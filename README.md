# quiz-admin-panel

Web-based Master Administrator Dashboard for **Quiz Arena** — the multi-tier tournament and skill gaming platform. Built with React 19, TypeScript, TailwindCSS, Vite, and Lucide Icons.

## 🚀 Features

- **System Overview**: Real-time platform metrics, active player statistics, category breakdown, and quick action shortcuts.
- **Hero Banners Management**: Upload, toggle active status, reorder, and configure dynamic CTA promotional banners for the mobile app home screen with live card previews.
- **Question Bank Management**: Multi-choice question creation with bilingual support (Tamil & English), difficulty grading, target education tiers, and bulk CSV/Excel upload.
- **Tournament & Arena Scheduler**: Create scheduled rooms, set entry fees, define prize pools, configure join windows, and review/release tournament results.
- **Player Profiling & Auditing**: Monitor registered users, demographic distribution, skill ELO ratings, and educational tiers.
- **Double-Entry Financial Ledger**: Audit deposits, entry fee collections, bonus rewards, and cash prize payouts.

## 🛠️ Tech Stack

- **Framework**: React 19 / Vite 6
- **Language**: TypeScript
- **Styling**: TailwindCSS & PostCSS
- **Icons**: Lucide React
- **Excel/CSV**: SheetJS (xlsx)
- **Networking**: Axios

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

