# Data Formatting Specification

## Overview
This document defines the number formatting rules for all dashboard visualizations and data displays.

## Formatted Output for Provided Data

### Original JSON:
```json
{
  "reply_count": 252,
  "reply_count_unique": 252,
  "emails_sent_count": 29209,
  "new_leads_contacted_count": 10730,
  "total_opportunities": 85,
  "total_opportunity_value": 188500
}
```

### Formatted Output:
```json
{
  "reply_count": "252",
  "reply_count_unique": "252",
  "emails_sent_count": "29K",
  "new_leads_contacted_count": "11K",
  "total_opportunities": "85",
  "total_opportunity_value": "$189K"
}
```

## Formatting Rules

### Rule 1: Numbers Under 1,000
**Display as-is without formatting**

Examples:
- `85` → `"85"`
- `252` → `"252"`
- `999` → `"999"`

### Rule 2: Numbers 1,000 - 9,999
**Use comma separators**

Examples:
- `1234` → `"1,234"`
- `5678` → `"5,678"`
- `9999` → `"9,999"`

### Rule 3: Numbers 10,000 - 99,999
**Context-dependent formatting**

#### Option A: COMPACT Context (Chosen for Dashboard)
Use K notation for visual displays:
- `10730` → `"11K"` (rounded)
- `29209` → `"29K"` (rounded)
- `50000` → `"50K"`

**Best for:**
- Dashboard metric cards
- Chart labels
- Visual summaries
- Mobile displays

**Reasoning:**
- Saves screen space
- Improves scannability
- Matches industry standards (Google Analytics, Salesforce, HubSpot)
- Better for at-a-glance understanding

#### Option B: FULL Context (Alternative)
Use comma separators for precision:
- `10730` → `"10,730"`
- `29209` → `"29,209"`
- `50000` → `"50,000"`

**Best for:**
- Detailed reports
- Data tables
- Export/CSV files
- When exact values matter

### Rule 4: Numbers 100,000+
**Always use K notation**

Examples:
- `188500` → `"189K"` (rounded)
- `250000` → `"250K"`
- `999999` → `"1000K"` or `"1M"` (if million notation enabled)

## Field-Specific Formatting Decisions

### reply_count: 252
- **Format:** `"252"`
- **Rule Applied:** Under 1,000 - display as-is
- **Reasoning:** Exact count important for response tracking

### reply_count_unique: 252
- **Format:** `"252"`
- **Rule Applied:** Under 1,000 - display as-is
- **Reasoning:** Exact count important for deduplication tracking

### emails_sent_count: 29,209
- **Format:** `"29K"` (COMPACT) or `"29,209"` (FULL)
- **Rule Applied:** 10K-99K range - context-dependent
- **Decision:** Using COMPACT `"29K"`
- **Reasoning:**
  - Dashboard metric card display
  - Volume metric where approximation is acceptable
  - Cleaner visual presentation
  - Aligns with industry dashboard standards

### new_leads_contacted_count: 10,730
- **Format:** `"11K"` (COMPACT) or `"10,730"` (FULL)
- **Rule Applied:** 10K-99K range - context-dependent
- **Decision:** Using COMPACT `"11K"`
- **Reasoning:**
  - Dashboard metric card display
  - Volume metric for outreach scale
  - Rounded up from 10,730 to 11K
  - Consistent with emails_sent_count formatting

### total_opportunities: 85
- **Format:** `"85"`
- **Rule Applied:** Under 1,000 - display as-is
- **Reasoning:**
  - Exact count critical for pipeline management
  - Small numbers should never use K notation
  - Every opportunity counts in sales tracking

### total_opportunity_value: 188,500
- **Format:** `"$189K"` (COMPACT) or `"$188,500"` (FULL)
- **Rule Applied:** 100K+ - always K notation for currency
- **Decision:** Using COMPACT `"$189K"`
- **Reasoning:**
  - Currency over $100K always uses K notation per rules
  - Rounded to nearest thousand (188.5K → 189K)
  - Standard practice for executive dashboards
  - Easier to compare large amounts at a glance

## Rounding Rules for K Notation

### Basic Rounding
Round to nearest thousand:
- `10,730` → `11K` (10.73K rounds up)
- `10,499` → `10K` (10.49K rounds down)
- `188,500` → `189K` (188.5K rounds up)

### Precision Guidelines
- **Under 10K:** Always show exact with commas
- **10K-99K:** Round to whole K (no decimals)
- **100K+:** Round to whole K (no decimals)
- **Optional:** For 1M+, can use `1.5M` format if needed

## Implementation

### JavaScript/TypeScript Utility Functions

```typescript
// Compact format (default for dashboard)
formatNumber(29209, 'compact')  // "29K"
formatNumber(10730, 'compact')  // "11K"
formatNumber(85, 'compact')     // "85"

// Full format (for reports)
formatNumber(29209, 'full')     // "29,209"
formatNumber(10730, 'full')     // "10,730"

// Currency format
formatCurrency(188500)          // "$189K"
formatCurrency(5000)            // "$5,000"
```

### Usage in Components

```typescript
// Dashboard Metrics Component
<MetricCard
  label="Emails Sent"
  value={formatNumber(emailsSent, 'compact')}  // "29K"
/>

// Detailed Report Component
<TableCell>
  {formatNumber(emailsSent, 'full')}  // "29,209"
</TableCell>

// Currency Display
<MetricCard
  label="Pipeline Value"
  value={formatCurrency(opportunityValue)}  // "$189K"
/>
```

## Visual Comparison

### Dashboard View (COMPACT)
```
┌─────────────────────────────┐
│ Emails Sent                 │
│ 29K                         │
│ Campaign reach              │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Leads Contacted             │
│ 11K                         │
│ Outreach volume             │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Pipeline Value              │
│ $189K                       │
│ Total opportunity value     │
└─────────────────────────────┘
```

### Report View (FULL)
```
| Metric            | Value    |
|-------------------|----------|
| Emails Sent       | 29,209   |
| Leads Contacted   | 10,730   |
| Replies           | 252      |
| Opportunities     | 85       |
| Pipeline Value    | $188,500 |
```

## Context Decision Matrix

| Display Type | Number Range | Format | Example |
|--------------|--------------|--------|---------|
| Dashboard Card | < 1K | As-is | 252 |
| Dashboard Card | 1K-9.9K | Comma | 1,234 |
| Dashboard Card | 10K-99K | K notation | 29K |
| Dashboard Card | 100K+ | K notation | 189K |
| Dashboard Card (Currency) | 100K+ | $K notation | $189K |
| | | |
| Detailed Table | < 1K | As-is | 252 |
| Detailed Table | 1K-9.9K | Comma | 1,234 |
| Detailed Table | 10K-99K | Comma | 29,209 |
| Detailed Table | 100K+ | Comma | 188,500 |
| Detailed Table (Currency) | Any | Comma | $188,500 |
| | | |
| Chart Label | < 1K | As-is | 252 |
| Chart Label | 1K-9.9K | Comma | 1,234 |
| Chart Label | 10K-99K | K notation | 29K |
| Chart Label | 100K+ | K notation | 189K |
| | | |
| Export/CSV | Any | Unformatted number | 29209 |
| Export/CSV (Display) | Any | Full comma | 29,209 |

## Accessibility Considerations

### Screen Readers
Always include full values in aria-labels:

```html
<div aria-label="Emails sent: 29,209">
  <span>29K</span>
</div>
```

### Tooltips
Show full precision on hover:

```html
<span title="Exact value: 29,209">29K</span>
```

## Industry Standards Reference

Our formatting aligns with industry-leading platforms:

- **Google Analytics:** Uses K notation for 10K+ (e.g., "29.2K")
- **Salesforce:** Uses K notation for dashboard cards
- **HubSpot:** Uses K notation with rounding
- **LinkedIn Analytics:** Uses K notation for reach metrics
- **Twitter Analytics:** Uses K notation for impressions

## Migration Notes

### Current Implementation
The dashboard currently uses:
- `toLocaleString()` for most numbers
- Inconsistent K notation

### Target Implementation
- Standardized formatting via utility functions
- Context-aware display (COMPACT vs FULL)
- Consistent rounding rules
- Proper currency formatting

## Testing Checklist

- [ ] Numbers under 1K display correctly (252 → "252")
- [ ] Numbers 1K-9.9K use commas (5,678 → "5,678")
- [ ] Numbers 10K-99K use K notation in COMPACT (29,209 → "29K")
- [ ] Numbers 10K-99K use commas in FULL (29,209 → "29,209")
- [ ] Numbers 100K+ use K notation (188,500 → "189K")
- [ ] Currency values format correctly ($188,500 → "$189K")
- [ ] Rounding works properly (10,730 → "11K")
- [ ] Tooltips show full values
- [ ] Aria-labels include precise numbers

## Summary

**For the provided data, using COMPACT context (recommended for dashboard):**

| Field | Original | Formatted | Reasoning |
|-------|----------|-----------|-----------|
| reply_count | 252 | `"252"` | Under 1K - exact value |
| reply_count_unique | 252 | `"252"` | Under 1K - exact value |
| emails_sent_count | 29,209 | `"29K"` | 10K-99K - K notation for dashboard |
| new_leads_contacted_count | 10,730 | `"11K"` | 10K-99K - K notation for dashboard |
| total_opportunities | 85 | `"85"` | Under 1K - exact count critical |
| total_opportunity_value | 188,500 | `"$189K"` | 100K+ - always K notation |

**Decision for 10K-99K range:** Using **K notation (COMPACT)** because:
1. Dashboard metric cards benefit from compact display
2. Aligns with industry standards
3. Improves scannability and user experience
4. Maintains consistency across all high-volume metrics
5. Mobile-friendly formatting
