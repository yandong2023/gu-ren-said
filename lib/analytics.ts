"use client";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sanitizeParams(params: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 120) : value])
  );
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, sanitizeParams(params));
}

export function trackVirtualPageView(path: string) {
  if (typeof window === "undefined") return;
  trackEvent("page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title
  });
}
