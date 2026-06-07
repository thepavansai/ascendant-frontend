# 🧠 Ascendant

> **Train Your Brain. Level Up Your Life.**

**🌍 Live Frontend:** [ascendantt.netlify.app](https://ascendantt.netlify.app)  
**⚙️ Live Backend:** [ascendant-backend.onrender.com](https://ascendant-backend.onrender.com)  

Ascendant is a Next.js 16 gamified learning platform designed to help children (ages 9-12) build critical thinking, decision-making, and AI literacy through mission-based challenges.

## 🚀 Features

- **Mission-Based Learning**: Real-world scenarios that replace traditional textbooks.
- **Role-Based Portals**:
  - **Child Dashboard**: Immersive progression tracking, XP, streaks, and active missions.
  - **Parent Portal**: Monitor child progression, approve accounts, and review metrics.
  - **Admin Center**: Manage global users and craft new missions.
- **AI-Powered Evaluation**: Instant, personalized feedback on reasoning quality.
- **Beautiful UI**: Highly polished, modern interface with smooth `framer-motion` animations, glassmorphism, and responsive design.

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State & Data Fetching**: TanStack Query v5 & Zustand
- **Styling**: Tailwind CSS v4 & Framer Motion
- **UI Components**: shadcn/ui & Lucide Icons
- **Backend Integration**: Secured via JWT to a custom Spring Boot Backend.

## 📦 Quick Start

### 1. Prerequisites
- Node.js 18+
- The **Ascendant Spring Boot Backend** running locally on port `8080`.

### 2. Installation
```bash
git clone https://github.com/thepavansai/ascendant-frontend.git
cd ascendant-frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory to point to your backend:
```env
NEXT_PUBLIC_BACKEND_URL=https://ascendant-backend.onrender.com
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:4000` to interact with the application!

## 📂 Architecture

- `/src/app/`: Next.js App Router with secure layout groups (`(admin)`, `(parent)`, `(child)`).
- `/src/components/`: Highly reusable UI elements, including specialized charts, layouts, and `shadcn/ui` primitives.
- `/src/lib/`: The core data layer containing Axios interceptors, React Query hooks, and Zustand global stores.

## 📄 License
&copy; 2026 Ascendant. All rights reserved.
