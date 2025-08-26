import OpenAI from 'openai';
import { db } from '@tbi/database';

// Define enums locally for now, or import from a shared types file
type TranslationJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRY';

interface TranslationJob {
  id: string;
  content_type: string;
  content_id: string;
  source_locale: string;
  target_locale: string;
  field_name: string;
  original_text: string;
  translated_text?: string;
  prompt_template: string;
  priority: number;
  status: TranslationJobStatus;
  processing_started?: Date;
  processing_ended?: Date;
  processing_time?: number;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  actual_cost?: number;
  quality_score?: number;
  error_message?: string;
  retry_count: number;
  created_at: Date;
  updated_at: Date;
}

interface TranslationRequest {
  contentType: 'report' | 'category' | 'blog';
  contentId: string;
  sourceLocale: string;
  targetLocale: string;
  fieldName: string;
  originalText: string;
  priority?: number;
}

export class TranslationService {
  private openai: OpenAI;
  private readonly LOCALES = {
    en: 'English',
    de: 'German',
    fr: 'French', 
    es: 'Spanish',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean'
  };

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async queueTranslation(request: TranslationRequest): Promise<string> {
    // Get or create prompt template
    const promptTemplate = await this.getPromptTemplate(request.fieldName);
    
    const result = await db.query(
      `INSERT INTO translation_jobs (
        content_type, content_id, source_locale, target_locale, field_name, original_text, prompt_template, priority, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        request.contentType,
        request.contentId,
        request.sourceLocale,
        request.targetLocale,
        request.fieldName,
        request.originalText,
        promptTemplate.templateText,
        request.priority || 0,
        'PENDING'
      ]
    );
    const jobId = result.rows[0].id;

    // Process immediately if high priority, otherwise queue
    if (request.priority && request.priority > 80) {
      await this.processTranslationJob(jobId);
    }

    return jobId;
  }

  async processTranslationJob(jobId: string): Promise<void> {
    const jobResult = await db.query(`SELECT * FROM translation_jobs WHERE id = $1`, [jobId]);
    const job = jobResult.rows[0];

    if (!job || job.status !== 'PENDING') {
      return;
    }

    await db.query(
      `UPDATE translation_jobs SET status = $1, processing_started = $2 WHERE id = $3`,
      ['PROCESSING', new Date(), jobId]
    );

    try {
      const startTime = Date.now();
      
      const systemPrompt = this.buildSystemPrompt(
        job.source_locale,
        job.target_locale,
        job.field_name
      );
      
      const response = await this.openai.chat.completions.create({
        model: job.ai_model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: job.original_text }
        ],
        temperature: job.temperature.toNumber(),
        max_tokens: job.max_tokens,
      });

      const translatedText = response.choices[0]?.message?.content || '';
      const processingTime = Date.now() - startTime;
      
      // Calculate costs (approximate - adjust based on actual OpenAI pricing)
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      const totalTokens = inputTokens + outputTokens;
      
      // GPT-4 pricing (as of 2024): $0.03/1k input tokens, $0.06/1k output tokens
      const inputCost = (inputTokens / 1000) * 0.03;
      const outputCost = (outputTokens / 1000) * 0.06;
      const totalCost = inputCost + outputCost;

      // Quality assessment (simplified - can be enhanced)
      const qualityScore = await this.assessTranslationQuality(
        job.original_text,
        translatedText,
        job.source_locale,
        job.target_locale
      );

      await db.query(
        `UPDATE translation_jobs SET
          status = $1, translated_text = $2, processing_ended = $3, processing_time = $4,
          input_tokens = $5, output_tokens = $6, total_tokens = $7, actual_cost = $8, quality_score = $9
        WHERE id = $10`,
        [
          'COMPLETED',
          translatedText,
          new Date(),
          processingTime,
          inputTokens,
          outputTokens,
          totalTokens,
          totalCost,
          qualityScore,
          jobId
        ]
      );

      // Update the corresponding translation record
      await this.updateTranslationRecord(job);

      // Log usage
      await this.logAPIUsage({
        serviceType: 'translation',
        model: job.ai_model,
        jobId: job.id,
        inputTokens,
        outputTokens,
        totalTokens,
        totalCost,
        responseTime: processingTime,
        success: true
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await db.query(
        `UPDATE translation_jobs SET
          status = $1, error_message = $2, processing_ended = $3, retry_count = retry_count + 1
        WHERE id = $4`,
        [
          job.retryCount >= 3 ? 'FAILED' : 'RETRY',
          errorMessage,
          new Date(),
          jobId
        ]
      );

      // Log failed usage
      await this.logAPIUsage({
        serviceType: 'translation',
        model: job.ai_model,
        jobId: job.id,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        totalCost: 0,
        responseTime: Date.now() - Date.now(),
        success: false,
        errorMessage: errorMessage
      });

      if (job.retry_count < 3) {
        // Schedule retry after delay
        setTimeout(() => this.processTranslationJob(jobId), 5000);
      }
    }
  }

  private buildSystemPrompt(sourceLocale: string, targetLocale: string, fieldName: string): string {
    const sourceLang = this.LOCALES[sourceLocale as keyof typeof this.LOCALES];
    const targetLang = this.LOCALES[targetLocale as keyof typeof this.LOCALES];
    
    const basePrompt = `You are a professional translator specializing in market research and business intelligence content. 
Translate the following ${fieldName} from ${sourceLang} to ${targetLang}.

CRITICAL REQUIREMENTS:
1. Maintain technical accuracy of all market terms, company names, and numerical data
2. Preserve SEO keywords while making them culturally appropriate
3. Adapt content for local market context and cultural nuances
4. Keep the professional, authoritative tone suitable for business intelligence
5. Ensure translations are optimized for search engines in the target region`;

    const fieldSpecificGuidelines = {
      title: "Keep titles concise and SEO-friendly. Maintain keyword relevance for local search.",
      description: "Preserve technical terms and industry jargon. Ensure readability and engagement.",
      summary: "Maintain key insights while adapting for local business context.",
      content: "Ensure accuracy of all market data, company names, and technical specifications.",
      keywords: "Translate and localize keywords for target market search behavior.",
      meta_title: "Optimize for local SEO while maintaining natural language flow.",
      meta_description: "Create compelling meta descriptions optimized for local search results."
    };

    return `${basePrompt}\n\nField-specific guidelines: ${fieldSpecificGuidelines[fieldName as keyof typeof fieldSpecificGuidelines] || 'Maintain accuracy and cultural appropriateness.'}\n\nProvide only the translated text without explanations or additional commentary.`;
  }

  private async assessTranslationQuality(
    original: string,
    translated: string,
    sourceLocale: string,
    targetLocale: string
  ): Promise<number> {
    // Simplified quality assessment - can be enhanced with more sophisticated methods
    const factors = {
      lengthSimilarity: Math.min(translated.length / original.length, 1.0),
      hasContent: translated.length > 0 ? 1 : 0,
      noErrors: !translated.toLowerCase().includes('error') ? 1 : 0,
      // Add more sophisticated checks as needed
    };

    const avgScore = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;
    return Math.round(avgScore * 100) / 100; // Round to 2 decimal places
  }

  private async updateTranslationRecord(job: TranslationJob): Promise<void> {
    const updateData = {
      [job.field_name]: job.translated_text,
      translation_job_id: job.id,
      ai_generated: true,
      translation_quality: job.quality_score,
      status: 'PENDING_REVIEW' as const
    };

    switch (job.content_type) {
      case 'report':
        const existingReportTranslation = await db.query(
          `SELECT id FROM report_translations WHERE report_id = $1 AND locale = $2`,
          [job.content_id, job.target_locale]
        );

        if (existingReportTranslation.rows.length > 0) {
          // Update
          const updateFields = Object.keys(updateData).map((key, index) => `${key} = ${index + 3}`).join(', ');
          const updateValues = Object.values(updateData);
          await db.query(
            `UPDATE report_translations SET ${updateFields} WHERE report_id = $1 AND locale = $2`,
            [job.content_id, job.target_locale, ...updateValues]
          );
        } else {
          // Insert
          const title = job.field_name === 'title' ? job.translated_text : 'Pending Translation';
          const description = job.field_name === 'description' ? job.translated_text : 'Translation in progress';
          const slug = `pending-${Date.now()}`;
          const metaTitle = job.field_name === 'meta_title' ? job.translated_text : 'Pending Translation';
          const metaDescription = job.field_name === 'meta_description' ? job.translated_text : 'Translation in progress';
          const keywords = job.field_name === 'keywords' ? (job.translated_text || '').split(',').map((k: string) => k.trim()) : [];

          await db.query(
            `INSERT INTO report_translations (
              report_id, locale, title, description, slug, meta_title, meta_description, keywords,
              translation_job_id, ai_generated, translation_quality, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              job.content_id, job.target_locale, title, description, slug, metaTitle, metaDescription, keywords,
              job.id, true, job.quality_score, 'PENDING_REVIEW'
            ]
          );
        }
        break;
        
      case 'category':
        const existingCategoryTranslation = await db.query(
          `SELECT id FROM category_translations WHERE category_id = $1 AND locale = $2`,
          [job.content_id, job.target_locale]
        );

        if (existingCategoryTranslation.rows.length > 0) {
          // Update
          const updateFields = Object.keys(updateData).map((key, index) => `${key} = ${index + 3}`).join(', ');
          const updateValues = Object.values(updateData);
          await db.query(
            `UPDATE category_translations SET ${updateFields} WHERE category_id = $1 AND locale = $2`,
            [job.content_id, job.target_locale, ...updateValues]
          );
        } else {
          // Insert
          const title = job.field_name === 'title' ? job.translated_text : 'Pending Translation';
          const slug = `pending-${Date.now()}`;

          await db.query(
            `INSERT INTO category_translations (
              category_id, locale, title, slug,
              translation_job_id, ai_generated, translation_quality, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              job.content_id, job.target_locale, title, slug,
              job.id, true, job.quality_score, 'PENDING_REVIEW'
            ]
          );
        }
        break;
    }
  }

  private async getPromptTemplate(fieldName: string) {
    const templateResult = await db.query(
      `SELECT * FROM ai_prompt_templates WHERE prompt_type = $1 AND is_active = $2 LIMIT 1`,
      ['translation', true]
    );
    let template = templateResult.rows[0];

    if (!template) {
      // Create default template
      const newTemplateResult = await db.query(
        `INSERT INTO ai_prompt_templates (
          name, prompt_type, template_text, version, is_active, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          'Default Translation Template',
          'translation',
          'Translate the following content maintaining technical accuracy and cultural appropriateness.',
          1,
          true,
          'system'
        ]
      );
      template = newTemplateResult.rows[0];
    }

    return template;
  }

  private async logAPIUsage(data: any): Promise<void> {
    const costPerToken = data.totalTokens > 0 ? data.totalCost / data.totalTokens : 0;
    await db.query(
      `INSERT INTO api_usage_logs (
        service_type, model, job_id, input_tokens, output_tokens, total_tokens, total_cost, response_time, success, error_message, cost_per_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        data.serviceType, data.model, data.jobId, data.inputTokens, data.outputTokens,
        data.totalTokens, data.totalCost, data.responseTime, data.success, data.errorMessage, costPerToken
      ]
    );
  }

  // Queue processing method to be called by cron job or scheduler
  async processTranslationQueue(batchSize = 5): Promise<void> {
    const pendingJobsResult = await db.query(
      `SELECT * FROM translation_jobs
       WHERE status IN ($1, $2)
       ORDER BY priority DESC, created_at ASC
       LIMIT $3`,
      ['PENDING', 'RETRY', batchSize]
    );
    const pendingJobs = pendingJobsResult.rows;

    const processingPromises = pendingJobs.map((job: TranslationJob) => 
      this.processTranslationJob(job.id).catch(error => 
        console.error(`Failed to process translation job ${job.id}:`, error)
      )
    );

    await Promise.allSettled(processingPromises);
  }
}