/**
 * Number Formatting Utility
 *
 * Formats numbers according to specific business rules:
 * - 1,000-9,999: Comma separators (e.g., "1,234")
 * - 10,000-99,999: Context-dependent (comma or K notation)
 * - 100,000+: K notation (e.g., "189K")
 */

export type FormattingContext = 'compact' | 'full' | 'currency';

/**
 * Format a number with comma separators
 */
export function formatWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a number with K notation
 */
export function formatWithK(num: number): string {
  return Math.round(num / 1000) + 'K';
}

/**
 * Main formatting function with context awareness
 *
 * @param num - The number to format
 * @param context - The formatting context:
 *   - 'compact': Prefer K notation for numbers >= 10,000
 *   - 'full': Use comma separators for all numbers
 *   - 'currency': Prefer K notation for amounts >= 100,000
 */
export function formatNumber(num: number, context: FormattingContext = 'compact'): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num >= 1000 && num < 10000) {
    return formatWithCommas(num);
  }

  if (num >= 10000 && num < 100000) {
    if (context === 'full') {
      return formatWithCommas(num);
    }
    return formatWithK(num);
  }

  if (num >= 100000) {
    return formatWithK(num);
  }

  return num.toString();
}

/**
 * Format currency values (always uses $ prefix)
 */
export function formatCurrency(num: number, context: FormattingContext = 'currency'): string {
  if (num >= 100000) {
    return '$' + formatWithK(num);
  }

  if (num >= 10000 && context === 'compact') {
    return '$' + formatWithK(num);
  }

  if (num >= 1000) {
    return '$' + formatWithCommas(num);
  }

  return '$' + num.toString();
}

/**
 * Format webhook/API data according to business rules
 */
export interface WebhookData {
  reply_count: number;
  reply_count_unique: number;
  emails_sent_count: number;
  new_leads_contacted_count: number;
  total_opportunities: number;
  total_opportunity_value: number;
}

export interface FormattedWebhookData {
  reply_count: string;
  reply_count_unique: string;
  emails_sent_count: string;
  new_leads_contacted_count: string;
  total_opportunities: string;
  total_opportunity_value: string;
}

/**
 * Format webhook data with context-appropriate formatting
 */
export function formatWebhookData(data: WebhookData): FormattedWebhookData {
  return {
    reply_count: formatNumber(data.reply_count, 'full'),
    reply_count_unique: formatNumber(data.reply_count_unique, 'full'),
    emails_sent_count: formatNumber(data.emails_sent_count, 'compact'),
    new_leads_contacted_count: formatNumber(data.new_leads_contacted_count, 'compact'),
    total_opportunities: formatNumber(data.total_opportunities, 'full'),
    total_opportunity_value: formatCurrency(data.total_opportunity_value, 'currency'),
  };
}

/**
 * Format for display in metric cards
 */
export function formatForMetricCard(value: number, type: 'count' | 'currency' | 'percentage'): string {
  if (type === 'percentage') {
    return value.toFixed(2) + '%';
  }

  if (type === 'currency') {
    return formatCurrency(value, 'compact');
  }

  return formatNumber(value, 'compact');
}

/**
 * Example formatting of the provided data
 */
export function formatExampleData(): FormattedWebhookData {
  const exampleData: WebhookData = {
    reply_count: 252,
    reply_count_unique: 252,
    emails_sent_count: 29209,
    new_leads_contacted_count: 10730,
    total_opportunities: 85,
    total_opportunity_value: 188500,
  };

  return formatWebhookData(exampleData);
}
