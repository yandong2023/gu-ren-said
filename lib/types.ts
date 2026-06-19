export type QuoteRecord = {
  id: string;
  quote: string;
  title: string;
  author: string;
  dynasty: string;
  source: string;
  context: string;
  translation: string;
  themes: string[];
  modernMeanings: string[];
  emotion: string;
  scene: string[];
  weight: number;
};

export type SearchResult = QuoteRecord & {
  score: number;
  matchedBy: string[];
  reason: string;
};

export type SlangMapping = {
  id: string;
  patterns: string[];
  keywords: string[];
  themes: string[];
  emotion: string;
  explanation: string;
};

export type ExpandedQuery = {
  original: string;
  normalized: string;
  terms: string[];
  themes: string[];
  emotion?: string;
  intentExplanation?: string;
};
