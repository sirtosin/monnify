# Echo — Reconciliation Engine Frontend

A Next.js frontend for the Echo end-to-end reconciliation engine. Automatically matches Monnify transactions with bank settlements, identifies discrepancies, and explains exactly what went wrong.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Redux Toolkit + RTK Query
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

### Dashboard
- Real-time reconciliation metrics (Reconciled Volume, Unmatched, Needs Review, Uncleared Amount)
- Settlement distribution pie chart
- Connection health monitoring with live status indicators
- Recent activity feed

### Soundboard (Payment Connections)
- Connect Monnify, Paystack, Flutterwave processors
- Toggle connections active/inactive
- Copy webhook URLs
- Live connection status with pulse animations

### Bank Statements
- Drag-and-drop CSV/Excel upload
- 6-step processing animation (validate → normalize → extract → match → fees → insights)
- Upload summary with matched/review/unmatched counts
- Recent uploads list

### Ledger
- Full transaction table with reconciliation status
- Confidence scores per match
- Credit/debit indicators

### Distortions (Unmatched Settlements)
- **Explainable mismatch drill-down** — side panel showing:
  - Expected vs Received amounts with variance
  - Echo Diagnosis (natural language explanation)
  - Recommended Action
  - Fee rules applied
  - Audit trail
- Confidence-based review controls (approve/reject)

### Insights (Natural Language Query)
- Debounced search bar (500ms)
- Suggested query chips
- Query result cards with structured data
- Graceful fallback for unsupported queries

### Settings
- Light/Dark/Auto theme toggle
- Demo mode toggle
- One-click demo reset

## API Integration (RTK Query)

All API calls go through RTK Query with automatic caching, deduplication, and background refetching:

| Endpoint | Hook | Purpose |
|----------|------|---------|
| `POST /auth/register` | `useRegisterMutation` | User registration |
| `POST /auth/login` | `useLoginMutation` | User login |
| `GET /auth/me` | `useGetMeQuery` | Current user |
| `GET /payfac-connections` | `useGetConnectionsQuery` | List processors |
| `POST /payfac-connections` | `useConnectProcessorMutation` | Connect processor |
| `GET /bank-statements` | `useGetStatementsQuery` | List statements |
| `POST /bank-statements` | `useUploadStatementMutation` | Upload statement |
| `GET /bank-ledger-entries` | `useGetLedgerEntriesQuery` | List ledger |
| `POST /reconciliation/run` | `useRunReconciliationMutation` | Run reconciliation |
| `GET /dashboard/metrics` | `useGetDashboardMetricsQuery` | Dashboard data |
| `POST /insights/query` | `useExecuteInsightQueryMutation` | NL queries |

All hooks fall back to demo data when the API is unavailable.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local to point to your Echo API

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with:
- Email: `ada@brightstore.ng`
- Password: `secret123`

## Demo Data

The app ships with a complete demo dataset:
- 1 Monnify connection (SANDBOX)
- 1 processed bank statement (42 rows, 38 matched, 3 review, 1 unmatched)
- 2 unmatched settlements (fee discrepancy + missing deposit)
- 1 needs-review match (74% confidence)
- Dashboard metrics showing ₦480K reconciled, ₦20K unmatched

Click **Reset Demo** in the header or Settings to restore initial state.

## Project Structure

```
app/
  (auth)/           # Login & Register pages
  (dashboard)/      # All protected pages
    page.tsx        # Dashboard
    soundboard/     # Payment connections
    statements/     # Upload & processing
    ledger/         # Bank ledger entries
    unmatched/      # Distorted signals
    insights/       # Natural language queries
    settings/       # Configuration
components/
  ui/               # shadcn/ui components
  layout/           # Sidebar, Header, MobileNav
  dashboard/        # Metrics, Charts, Activity
  soundboard/       # Connection cards, dialogs
  statements/       # Upload zone, processing animation
  ledger/           # Data table
  unmatched/        # Mismatch cards, detail panel
  insights/         # Search bar, query results
  shared/           # Empty states, loading, errors
lib/
  store/
    api/            # RTK Query API slice
    slices/         # Redux slices
  hooks/            # Custom React hooks
  utils/            # Formatters, constants, demo data
types/              # TypeScript types
```

## Echo Theme Mapping

| Creative Label | Operational Term |
|----------------|-------------------|
| Soundboard | Payment Connections |
| Distorted Signals | Unmatched Settlements |
| Echo Volume | Reconciled Volume |
| Signal → Resonance → Echo | Transactions → Settlement → Reconciliation |

## License

MIT
