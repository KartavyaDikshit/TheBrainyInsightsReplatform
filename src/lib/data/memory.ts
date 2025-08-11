// Define types for our data
export interface Category {
  id: string;
  slug: string;
  translations: Record<string, { name: string; description: string }>;
}

export interface Report {
  id: string;
  slug: string;
  categorySlug: string;
  featured?: boolean;
  translations: Record<string, { title: string; summary: string; bodyHtml: string; seoTitle: string; seoDesc: string; keywords: string }>;
}

export interface Redirect {
  oldPath: string;
  newPath: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  locale: string;
}

export interface AIQueueItem {
  id: string;
  target: string;
  locale: string;
  status: string;
  preview: any;
}


// In-memory store
let categories: Category[] = [];
let reports: Report[] = [];
let redirects: Redirect[] = [];
let leads: Lead[] = [];
let aiQueue: AIQueueItem[] = [];

let stubsLoaded = false;

export async function loadStubsOnce() {
  if (stubsLoaded) {
    return;
  }

  // Only load fs and path on the server side
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');

    const dataDir = 'C:\\Users\\User\\TheBrainyInsightsReplatform\\seed\\demo';

    categories = JSON.parse(fs.default.readFileSync(path.default.join(dataDir, 'categories.json'), 'utf-8'));
    reports = JSON.parse(fs.default.readFileSync(path.default.join(dataDir, 'reports.json'), 'utf-8'));
    redirects = JSON.parse(fs.default.readFileSync(path.default.join(dataDir, 'redirects.json'), 'utf-8'));
    leads = JSON.parse(fs.default.readFileSync(path.default.join(dataDir, 'leads.json'), 'utf-8'));
    aiQueue = JSON.parse(fs.default.readFileSync(path.default.join(dataDir, 'ai_queue.json'), 'utf-8'));
  }

  stubsLoaded = true;
}

// Getters
export const getCategories = () => categories;
export const getReports = () => reports;
export const getRedirects = () => redirects;
export const getLeads = () => leads;
export const getAIQueue = () => aiQueue;

// Mutations
export function addLead(lead: Omit<Lead, 'id'>): Lead {
    const newLead = { ...lead, id: `lead-${Date.now()}` };
    leads.push(newLead);
    return newLead;
}

export function updateAIQueueItem(id: string, status: 'APPROVED' | 'REJECTED'): AIQueueItem | undefined {
    const item = aiQueue.find(item => item.id === id);
    if (item) {
        item.status = status;
    }
    return item;
}