export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Sends a pageview event to Google Analytics.
 */
export const pageview = (url: URL | string): void => {
  if (typeof window.gtag === 'function' && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

/**
 * Dispatches a custom tracking event to Google Analytics.
 */
export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (typeof window.gtag === 'function' && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      trackingIdOrAction: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: Record<string, any>[];
  }
}
