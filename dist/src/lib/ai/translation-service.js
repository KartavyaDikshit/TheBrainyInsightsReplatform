import OpenAI from 'openai';
import { prisma } from '@tbi/database';
export class TranslationService {
    constructor() {
        this.LOCALES = {
            en: 'English',
            de: 'German',
            fr: 'French',
            es: 'Spanish',
            it: 'Italian',
            ja: 'Japanese',
            ko: 'Korean'
        };
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async queueTranslation(request) {
        // Get or create prompt template
        const promptTemplate = await this.getPromptTemplate(request.fieldName);
        const job = await prisma.translationJob.create({
            data: {
                contentType: request.contentType,
                contentId: request.contentId,
                sourceLocale: request.sourceLocale,
                targetLocale: request.targetLocale,
                fieldName: request.fieldName,
                originalText: request.originalText,
                promptTemplate: promptTemplate.templateText,
                priority: request.priority || 0,
                status: 'PENDING'
            }
        });
        // Process immediately if high priority, otherwise queue
        if (request.priority && request.priority > 80) {
            await this.processTranslationJob(job.id);
        }
        return job.id;
    }
    async processTranslationJob(jobId) {
        var _a, _b, _c, _d;
        const job = await prisma.translationJob.findUnique({
            where: { id: jobId }
        });
        if (!job || job.status !== 'PENDING') {
            return;
        }
        await prisma.translationJob.update({
            where: { id: jobId },
            data: {
                status: 'PROCESSING',
                processingStarted: new Date()
            }
        });
        try {
            const startTime = Date.now();
            const systemPrompt = this.buildSystemPrompt(job.sourceLocale, job.targetLocale, job.fieldName);
            const response = await this.openai.chat.completions.create({
                model: job.aiModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: job.originalText }
                ],
                temperature: job.temperature.toNumber(),
                max_tokens: job.maxTokens,
            });
            const translatedText = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '';
            const processingTime = Date.now() - startTime;
            // Calculate costs (approximate - adjust based on actual OpenAI pricing)
            const inputTokens = ((_c = response.usage) === null || _c === void 0 ? void 0 : _c.prompt_tokens) || 0;
            const outputTokens = ((_d = response.usage) === null || _d === void 0 ? void 0 : _d.completion_tokens) || 0;
            const totalTokens = inputTokens + outputTokens;
            // GPT-4 pricing (as of 2024): $0.03/1k input tokens, $0.06/1k output tokens
            const inputCost = (inputTokens / 1000) * 0.03;
            const outputCost = (outputTokens / 1000) * 0.06;
            const totalCost = inputCost + outputCost;
            // Quality assessment (simplified - can be enhanced)
            const qualityScore = await this.assessTranslationQuality(job.originalText, translatedText, job.sourceLocale, job.targetLocale);
            await prisma.translationJob.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    translatedText,
                    processingEnded: new Date(),
                    processingTime,
                    inputTokens,
                    outputTokens,
                    totalTokens,
                    actualCost: totalCost,
                    qualityScore
                }
            });
            // Update the corresponding translation record
            await this.updateTranslationRecord(job);
            // Log usage
            await this.logAPIUsage({
                serviceType: 'translation',
                model: job.aiModel,
                jobId: job.id,
                inputTokens,
                outputTokens,
                totalTokens,
                totalCost,
                responseTime: processingTime,
                success: true
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await prisma.translationJob.update({
                where: { id: jobId },
                data: {
                    status: job.retryCount >= 3 ? 'FAILED' : 'RETRY',
                    errorMessage,
                    processingEnded: new Date(),
                    retryCount: { increment: 1 }
                }
            });
            // Log failed usage
            await this.logAPIUsage({
                serviceType: 'translation',
                model: job.aiModel,
                jobId: job.id,
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                totalCost: 0,
                responseTime: Date.now() - Date.now(),
                success: false,
                errorMessage
            });
            if (job.retryCount < 3) {
                // Schedule retry after delay
                setTimeout(() => this.processTranslationJob(jobId), 5000);
            }
        }
    }
    buildSystemPrompt(sourceLocale, targetLocale, fieldName) {
        const sourceLang = this.LOCALES[sourceLocale];
        const targetLang = this.LOCALES[targetLocale];
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
        return `${basePrompt}\n\nField-specific guidelines: ${fieldSpecificGuidelines[fieldName] || 'Maintain accuracy and cultural appropriateness.'}\n\nProvide only the translated text without explanations or additional commentary.`;
    }
    async assessTranslationQuality(original, translated, sourceLocale, targetLocale) {
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
    async updateTranslationRecord(job) {
        const updateData = {
            [job.fieldName]: job.translatedText,
            translationJobId: job.id,
            aiGenerated: true,
            translationQuality: job.qualityScore,
            status: 'PENDING_REVIEW'
        };
        switch (job.contentType) {
            case 'report':
                await prisma.reportTranslation.upsert({
                    where: {
                        reportId_locale: {
                            reportId: job.contentId,
                            locale: job.targetLocale
                        }
                    },
                    update: updateData,
                    create: Object.assign(Object.assign({ reportId: job.contentId, locale: job.targetLocale }, updateData), { 
                        // Add required fields with default values
                        title: job.fieldName === 'title' ? job.translatedText : 'Pending Translation', description: job.fieldName === 'description' ? job.translatedText : 'Translation in progress', slug: `pending-${Date.now()}`, metaTitle: job.fieldName === 'meta_title' ? job.translatedText : 'Pending Translation', metaDescription: job.fieldName === 'meta_description' ? job.translatedText : 'Translation in progress', keywords: job.fieldName === 'keywords' ? job.translatedText.split(',').map((k) => k.trim()) : [], report: { connect: { id: job.contentId } } })
                });
                break;
            case 'category':
                await prisma.categoryTranslation.upsert({
                    where: {
                        categoryId_locale: {
                            categoryId: job.contentId,
                            locale: job.targetLocale
                        }
                    },
                    update: updateData,
                    create: Object.assign(Object.assign({ categoryId: job.contentId, locale: job.targetLocale }, updateData), { title: job.fieldName === 'title' ? job.translatedText : 'Pending Translation', slug: `pending-${Date.now()}`, category: { connect: { id: job.contentId } } })
                });
                break;
        }
    }
    async getPromptTemplate(fieldName) {
        let template = await prisma.aIPromptTemplate.findFirst({
            where: {
                promptType: 'translation',
                isActive: true
            }
        });
        if (!template) {
            // Create default template
            template = await prisma.aIPromptTemplate.create({
                data: {
                    name: 'Default Translation Template',
                    promptType: 'translation',
                    templateText: 'Translate the following content maintaining technical accuracy and cultural appropriateness.',
                    version: 1,
                    isActive: true,
                    createdBy: 'system' // You might want to use actual admin ID
                }
            });
        }
        return template;
    }
    async logAPIUsage(data) {
        await prisma.aPIUsageLog.create({
            data: Object.assign(Object.assign({}, data), { costPerToken: data.totalTokens > 0 ? data.totalCost / data.totalTokens : 0 })
        });
    }
    // Queue processing method to be called by cron job or scheduler
    async processTranslationQueue(batchSize = 5) {
        const pendingJobs = await prisma.translationJob.findMany({
            where: {
                status: { in: ['PENDING', 'RETRY'] }
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'asc' }
            ],
            take: batchSize
        });
        const processingPromises = pendingJobs.map(job => this.processTranslationJob(job.id).catch(error => console.error(`Failed to process translation job ${job.id}:`, error)));
        await Promise.allSettled(processingPromises);
    }
}
