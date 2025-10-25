import { formatWebhookData, WebhookData } from './numberFormatter';

// Original JSON data
const originalData: WebhookData = {
  reply_count: 252,
  reply_count_unique: 252,
  emails_sent_count: 29209,
  new_leads_contacted_count: 10730,
  total_opportunities: 85,
  total_opportunity_value: 188500,
};

console.log('=== FORMATTED WEBHOOK DATA ===\n');

const formatted = formatWebhookData(originalData);

console.log('Original Data:');
console.log(JSON.stringify(originalData, null, 2));

console.log('\n\nFormatted Data:');
console.log(JSON.stringify(formatted, null, 2));

console.log('\n\n=== FORMATTING BREAKDOWN ===\n');

console.log('reply_count: 252');
console.log('  → Formatted: "252"');
console.log('  → Reasoning: Under 1,000, display as-is\n');

console.log('reply_count_unique: 252');
console.log('  → Formatted: "252"');
console.log('  → Reasoning: Under 1,000, display as-is\n');

console.log('emails_sent_count: 29,209');
console.log('  → Formatted: "29K"');
console.log('  → Reasoning: In 10K-99K range, using K notation (compact context)');
console.log('  → This is ideal for dashboard metric cards where space is limited');
console.log('  → Alternative: "29,209" if full precision is needed\n');

console.log('new_leads_contacted_count: 10,730');
console.log('  → Formatted: "11K"');
console.log('  → Reasoning: In 10K-99K range, using K notation (compact context)');
console.log('  → Provides clean, scannable numbers in visualizations');
console.log('  → Alternative: "10,730" for detailed reports\n');

console.log('total_opportunities: 85');
console.log('  → Formatted: "85"');
console.log('  → Reasoning: Under 1,000, display as-is');
console.log('  → Exact count is important for opportunity tracking\n');

console.log('total_opportunity_value: 188,500');
console.log('  → Formatted: "$189K"');
console.log('  → Reasoning: Over 100K, always use K notation');
console.log('  → Rounds to nearest thousand: 188,500 → 189K');
console.log('  → Currency values prioritize readability over precision\n');

console.log('\n=== FORMATTING DECISION MATRIX ===\n');
console.log('For numbers in the 10,000-99,999 range:\n');
console.log('Context: COMPACT (chosen for emails_sent_count, new_leads_contacted_count)');
console.log('  ✓ Use K notation (29K, 11K)');
console.log('  ✓ Best for: Dashboard cards, charts, quick scanning');
console.log('  ✓ Saves space, improves readability\n');

console.log('Context: FULL (alternative option)');
console.log('  • Use comma separators (29,209, 10,730)');
console.log('  • Best for: Detailed reports, tables, exact counts');
console.log('  • Preserves precision\n');

console.log('\n=== RECOMMENDED USAGE BY COMPONENT ===\n');
console.log('Dashboard Metric Cards: Use COMPACT format');
console.log('  - reply_count: "252"');
console.log('  - emails_sent_count: "29K"');
console.log('  - new_leads_contacted_count: "11K"');
console.log('  - total_opportunities: "85"');
console.log('  - total_opportunity_value: "$189K"\n');

console.log('Detailed Tables/Reports: Use FULL format');
console.log('  - reply_count: "252"');
console.log('  - emails_sent_count: "29,209"');
console.log('  - new_leads_contacted_count: "10,730"');
console.log('  - total_opportunities: "85"');
console.log('  - total_opportunity_value: "$188,500"\n');

console.log('Chart Labels: Use COMPACT format');
console.log('  - Funnel stages: "29K → 11K → 252"');
console.log('  - Y-axis labels: "0, 10K, 20K, 30K"');
console.log('  - Data points: "$189K pipeline value"\n');