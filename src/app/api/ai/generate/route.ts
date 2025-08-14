import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth'; // Import auth from your auth.ts

export const dynamic = 'force-dynamic';

let openai: OpenAI;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  openai = {
    chat: {
      completions: {
        create: async () => {
          console.warn("OpenAI client not initialized: OPENAI_API_KEY is missing.");
          return { choices: [{ message: { content: "" } }], usage: { total_tokens: 0 } };
        },
      },
    },
  } as any;
}
const prisma = new PrismaClient();

const MASTER_PROMPT_TEMPLATE = `
PART-1: Market Introduction:
Copy from Here:
Generate an authoritative and insightful market research summary on the (market_name) with a strong focus on data-driven storytelling and strategic relevance. The content should be structured to meet the needs of C-level decision-makers, investors, and analysts, while being optimized for search engines. Make sure the word count remains under 300 words. Follow the structure below and remember to provide the content in paragraph format only, do not provide bullet point lists
1. Compelling Market Opening:
o Begin with: “The (market_name) was valued at USD XX Billion in 2025…”
o Clearly mention the market size in 2025, forecasted market size for 2034, and CAGR during the 2025–2034 period.
o Ensure all values are precise and use up-to-date calculations or estimates from reliable data sources, avoid using numbers from market research companies.
2. Market Definition and Overview:
o Provide a concise, SEO-optimized definition of the (market_name).
3. Current Market Momentum & Relevance:
o Explain why this market is attracting attention now.
4. SEO and Writing Guidelines:
o Use clear, concise, and informative language tailored for a professional audience.
o Avoid filler phrases like “in conclusion,” “in summary,” or generic clichés.
o Do not cite unnamed research firms. Only use sources with public credibility or institutional authority.
o Ensure content includes primary and secondary keywords naturally to boost SEO.

PART-2: Market Dynamics:
Copy from Here:
now create content for this section for (market_name)
Objective: Generate a compelling "Market Dynamics" section for the (market_name) report, clearly segmented into Market Drivers, Market Restraints, and Market Opportunities. The tone must be analytical, data-backed, and tailored for a strategic audience (executives, investors, policymakers), while ensuring SEO-rich content that ranks on SERPs. Follow the structure below and remember to provide the content in paragraph format only, do not provide bullet point lists
📌 Prompt Structure and Instructions:
________________________________________
🔹 A. Market Drivers
• List 2–4 key growth drivers that are accelerating the market’s expansion.
• Support each driver with quantitative data, market behavior, or recent industry developments (e.g., “As per WHO, digital health tool adoption grew by 68% from 2021 to 2024 globally.”).
• Focus on relevant factors like:
o Technological innovations
o Regulatory tailwinds
o Rising end-user demand
o ESG/sustainability initiatives
o Enterprise digitization/OEM adoption
• Emphasize why these drivers matter now and how they align with larger macroeconomic or industry-specific transformations.
________________________________________
🔹 B. Market Restraints
• Identify 1–3 significant market restraints or barriers to growth.
• Use specific, data-driven examples (e.g., “Limited data interoperability in AI systems has caused delays in clinical deployment in 42% of U.S. hospitals.”).
• Focus on challenges like:
o Regulatory uncertainties
o High upfront costs
o Technical or infrastructure limitations
o Skilled labor shortages
o Market fragmentation or compliance complexities
________________________________________
🔹 C. Market Opportunities
• Highlight emerging opportunities that could unlock future growth.
• Provide insights on:
o Untapped regions or demographics
o Evolving customer behavior
o Adjacent industry convergence (e.g., AI + cybersecurity)
o Public or private funding incentives
o Innovation pipelines or new business models
• Where possible, use forward-looking insights and cite government initiatives, venture capital trends, or innovation ecosystems.
________________________________________
SEO and Style Guidelines:
• Maintain a professional yet accessible tone suitable for business leaders and analysts.
• Integrate target and secondary keywords naturally within content.
• Avoid vague language or unverified predictions.
• Do not cite generic market research firms or use placeholder phrases like “expected to grow exponentially.”
• Keep paragraphs concise and logically connected for enhanced readability and SEO.

PART-3: Segment Analysis:
PART1
Copy from Here:
now create content for this section for (market_name)
Objective: Generate an in-depth “Regional Insights” section for the (market_name) report, Select the one with largest market share out of these 3 regions (North America, Asia-Pacific, and Europe). The regional subsection must open with current and forecasted market size, CAGR, and key growth factors that are relevant to the region and market_name. The language should appeal to executives and analysts, while supporting SEO goals with keyword-rich, authoritative content.

________________________________________
📌 Prompt Structure and Instructions:
🔷 Region Name
• Start with market sizing:
“The Region name (market_name) market was valued at USD XX Billion in 2024 and is forecasted to reach USD XX Billion by 2034, registering a CAGR of XX.X% during the forecast period.”
• Follow with region-specific drivers such as:
o Government regulations or funding (e.g., FDA approvals, Infrastructure Bill)
o High technology adoption rate
o Consumer behavior or industry maturity
o Strong presence of leading manufacturers or startups
o Investment in R&D or digital transformation
• Mention one leading country from the selected region (e.g., U.S., Canada) and their roles, when relevant.
• Include validated data points from sources like U.S. Department of Commerce, NIH, FDA, StatCan, etc.
✅ SEO and Style Guidelines:
• Use region + market_name in headings and body copy (e.g., “North America Electric Vehicle Market”).
• Maintain a formal, analytical tone suitable for senior decision-makers.
• Ensure each region’s narrative is unique and avoids repetition across sections.
• Integrate primary and secondary keywords naturally.
• Avoid vague phrases and unverified projections; use credible data points only.
• No citation of generic market research firms.

PART2
AI Prompt for “Market Segmentation” Section
Copy from Here:
now create content for this section for (market_name)
Objective: Generate the complete segmentation structure for the (market_name) report, followed by detailed insights into each major segment. The output must be structured, exhaustive, and tailored to appeal to decision-makers while remaining optimized for SEO.
________________________________________
🔷 PART 1: Segmentation Structure (List Format Only)
Instructions:
Generate a clean, bullet-point list of all major segments and sub-segments relevant to (market_name). Use the following structure:
• Start each primary segment category with:
• By [Segment Category]
• List all relevant sub-segments below as indented bullets.
• Ensure the segmentation reflects the real structure and dynamics of the market_name, including factors like product type, application, deployment, end user, distribution channel, technology, or geography—whichever apply.
• Do not include explanations, analysis, or market size data here.
• Keep the list exhaustive but concise—no fluff, just structured classification.
• Make sure segments are customized to (market_name)—not generic.
Example Format to Follow (for AI to replicate):
• By Product Type
  • Sub-segment 1
  • Sub-segment 2
  • Sub-segment 3
• By Application
  • Sub-segment 1
  • Sub-segment 2
• By End User
  • Sub-segment 1
  • Sub-segment 2
  • Sub-segment 3
PART 2: Segment-Level Analysis (With Data)
Based on the segmentation section generated, I would like you to create me the report title:
Format: (market_name) Market Size By Primary Category 1(sub-segment list in comma separated format), By Primary Category 1(sub-segment list in comma separated format), Regions, Global Industry Analysis, Share, Growth, Trends, and Forecast 2025 to 2034
Only generate for first 2 Primary Category skip others
Example: Quantum Encryption Market Size by Component (Quantum Key Distribution (QKD) Systems, Quantum Random Number Generators, Others), Application (Government & Financial Services, Healthcare, Others), Regions, Global Industry Analysis, Share, Growth, Trends, and Forecast 2025 to 2034

PART 3: Segment-Level Analysis (With Data)
Instructions:
For maximum of 3 and minimum of 2 primary segment category defined above (e.g., By Product Type, By Application), do not provide content on Regional section, generate a structured analysis using the format below:
1. Introduction Format (repeat for each major segment):
• Begin with the line:
“By [Segment Category], the (market_name) market was segmented into…”
• List the sub-segments in a short sentence form.
2. Highlight the Key Segments:
• Identify:
o The largest sub-segment (by 2024 market share)
• Begin with the line:
“The [largest sub-segment], dominated the (market_name) market , with a market share of around xx% in 2024.”
4. Explain the Growth Drivers (qualitative + data):
• Write in paragraph format.
• Provide key drivers that are fueling demand or adoption of the largest sub-segment.
• Include quantitative evidence or industry validation (e.g., “Rising demand from SMEs led to a 42% increase in deployment of cloud-based solutions in 2023”).
• Focus on technology adoption, regulations, user trends, cost dynamics, performance, and ease of implementation, depending on segment type.
________________________________________
✅ SEO and Writing Guidelines:
• Include primary and long-tail keywords naturally (e.g., “[cloud-based HR software], [industrial robotics in automotive sector], [digital payment in retail]”).
• Maintain a professional, structured tone aimed at analysts, executives, and investors.
• Avoid repetitive language or vague claims.
• Do not use generic summaries or cite unnamed research firms.

PART-4: Some of the Key Market Players:
Copy from Here:
now create content for this section for (market_name)
PART 1: Some of the Key Market Players
Instructions:
• Generate a bullet-point list of the Top 10 companies operating in the (market_name).
• Only include verified, real companies actively involved in the industry. Use company names that are:
o Publicly traded or widely recognized in the space
o Known for manufacturing, supplying, or innovating in this domain
o Covered in reputable news, industry sources, or regulatory filings
• If real companies are unavailable, omit placeholders like “Company1” or “XYZ Corp.” Do not use hypothetical names.
• The list should be rank-neutral (i.e., not in order of market share unless verified).
Format Example:
• Siemens AG
• General Electric Company
• Johnson Controls International
• Honeywell International Inc.
• ABB Ltd.
• Schneider Electric SE
• 3M Company
• Rockwell Automation, Inc.
• Mitsubishi Electric Corporation
• Emerson Electric Co.

PART 2: Recent Strategic Developments
Instructions:
• Provide a bullet list of 1–2 real, recent (2024 only) developments from companies listed above or other leading players in (market_name).
• Each item should follow this format:
“[Month] 2024: [Company] introduced [Product/Partnership/Acquisition] to [Intent/Outcome].”
• Ensure developments are:
o Specific and relevant to the (market_name)
o Based on real-world events: product launches, partnerships, funding rounds, M&As, tech upgrades, regulatory wins, or expansions
• Avoid vague, unverified, or undated statements. No generic headlines like "Company expanded product portfolio."
SEO and Professional Guidelines:
• Integrate relevant market_name keywords (e.g., “Key players in the renewable energy storage market include…”).
• Avoid filler phrases like “many companies are involved.”
• Use a credible tone suited for executives, analysts, and institutional stakeholders.
• Validate company names and developments against real news or press releases.
• Never cite or fabricate market research firm names or unverifiable sources.
`;

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: 'API bypassed during build' }, { status: 200 });
  }

  const session = await auth();
  if (!session || session.user?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, locale } = await request.json();

    if (!topic || !locale) {
      return NextResponse.json({ error: 'Topic and locale are required' }, { status: 400 });
    }

    const fullPrompt = MASTER_PROMPT_TEMPLATE.replace(/\(market_name\)/g, topic) + `. Ensure the output is in ${locale} language.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    const aiQueueItem = await prisma.aIGenerationQueue.create({
      data: {
        prompt: fullPrompt,
        outputJson: generatedContent,
        status: 'PENDING_REVIEW',
        locale: locale,
        tokenCount: completion.usage?.total_tokens || 0,
        costCents: (completion.usage?.total_tokens || 0) * 0.00001
      },
    });

    return NextResponse.json({
      message: 'AI content generated and queued for review',
      content: generatedContent,
      queueId: aiQueueItem.id,
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Failed to generate AI content' }, { status: 500 });
  }
}