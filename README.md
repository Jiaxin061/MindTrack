# 🧠 MindTrack – Multimodal Burnout Detection

![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite) ![License](https://img.shields.io/badge/License-Academic-blue)

**MindTrack** is an explainable AI proof-of-concept for multimodal burnout detection. It monitors and visualizes early indicators of mental fatigue and burnout using a combination of simulated biometric data, voice analysis, facial recognition, and text sentiment analysis—all powered by transparent, knowledge-based reasoning rules.

**Live Demo**: [MindTrack Prototype](https://comfy-sunshine-c05664.netlify.app/)

---

## Table of Contents
- [What is MindTrack?](#what-is-mindtrack)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core AI Components](#core-ai-components)
- [How to Use](#how-to-use)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Team & Acknowledgments](#team--acknowledgments)
- [Disclaimer](#-disclaimer)

---

## What is MindTrack?

MindTrack is a **frontend-only React application** that synthesizes multimodal data into a **Cognitive Health Index (CHI)** score—a unified wellness metric ranging from 0-100. The system employs **transparent, rule-based reasoning** (no machine learning black boxes) to assess burnout risk and provide explainable insights.

### Why Explainability Matters
Every CHI score includes:
- ✅ Contribution breakdown from each modality (sleep, biometrics, voice, facial, behavioral)
- ✅ Clear explanations of why rules fired
- ✅ Timeline of events showing cause → effect → action
- ✅ Recommendations with reasoning

This is academic research into **responsible AI**—demonstrating how AI systems can be both powerful and transparent.

---

## Key Features

### 🎯 Core Intelligence
- **Cognitive Health Index (CHI)** – Weighted aggregation of 5 modalities
  - Sleep (35%) | Biometrics (25%) | Facial (20%) | Voice (15%) | Behavioral (5%)
- **Knowledge-Based Rules Engine** – 5 interpretable rules for burnout detection
  - KR1: Emotional Overload (facial + voice stress)
  - KR2: Sleep & Mood Crisis (poor sleep + negative text sentiment)
  - KR3: Cognitive Fatigue (text stress indicators)
  - KR4: Systemic Overload (≥2 stressed modalities)
  - KR5: Critical Burnout Alert (all four conditions present)
- **Text Sentiment Analysis** – Psychological state from writing patterns
  - Sentiment score, stress indicators, emotional word detection

### 📊 Data Visualization
- **Daily Summary** – Detailed hourly breakdown with timeline
  - Overview tab: CHI score, contribution charts, sensor readings, psychological state
  - Rules tab: Which burnout detection rules fired and why
  - Timeline tab: Chronological event sequence with timestamps
- **Weekly Trends** – 7-day patterns and statistics
  - Average CHI, sleep, HRV, stress levels
  - Risk level distribution chart
  - Top burnout drivers
- **Monthly Patterns** – 30-day insights and progress
  - Monthly CHI trend line
  - Risk distribution pie chart
  - Longest low-risk streak calculation
  - Month-over-month improvement percentage

### 🛡️ Design Principles
- **Emotional Safety** – Non-judgmental, supportive language and UX
- **Accessibility** – WCAG AA compliance with proper ARIA labels
- **Transparency** – Clear disclaimers about data sources and limitations
- **Mobile-First** – Optimized for smartphones and tablets

---

## Getting Started

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

### Environment Variables (Optional)
Create `.env.local` if needed:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```
> Note: Currently uses simulated mock data. API integration is for future enhancements.

---

## Project Structure

```
MindTrack/
├── 📁 components/              # Reusable UI components
│   ├── DisclaimerModal.tsx      # Safety & transparency dialog
│   ├── ProgressRing.tsx         # Circular progress indicator
│   ├── DashboardCard.tsx        # Card layout component
│   └── BottomNav.tsx            # Navigation bar
│
├── 📁 screens/                 # Full-page views
│   ├── Dashboard.tsx           # Main dashboard with CHI overview
│   ├── DailySummary.tsx        # Detailed daily analysis (new: text sentiment)
│   ├── WeeklySummary.tsx       # 7-day trends
│   ├── MonthlySummary.tsx      # 30-day patterns
│   ├── Insights.tsx            # Sleep and wellness trends
│   ├── Record.tsx              # Intervention logging
│   ├── Devices.tsx             # Wearable device management
│   └── Settings.tsx            # App configuration
│
├── 📁 utils/                   # Core AI logic
│   ├── chi.ts                  # CHI calculation algorithm
│   ├── rules.ts                # Knowledge-based rules (KR1-KR5)
│   └── mockData.ts             # Deterministic data generation
│
├── 📁 public/                  # Static assets
├── App.tsx                     # Router & main layout
├── types.ts                    # TypeScript interfaces
├── constants.ts                # App constants
├── index.tsx                   # React entry point
├── index.css                   # Global styles
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies & scripts
```

---

## Core AI Components

### 1. CHI Algorithm (`utils/chi.ts`)

The Cognitive Health Index is a **deterministic scoring system** that synthesizes multimodal data:

```typescript
// Example calculation
const chiResult = calculateCHI(sleep, voice, facial, biometrics);
// Returns: { chiScore: 64, riskLevel: "Moderate", contributions: [...] }
```

**How it works:**
- Sleep: 35 points (if 7h + 80% quality → 28/35)
- Biometrics: 25 points (HR, HRV, stress → 18/25)
- Facial: 20 points (fatigue score → 12/20)
- Voice: 15 points (stress level → 9/15)
- Behavioral: 5 points (placeholder → 0/5)
- **Total**: 67/100 = Moderate Risk

Each contribution includes an explanation visible to the user.

### 2. Knowledge-Based Rules (`utils/rules.ts`)

Five interpretable rules detect burnout patterns:

```typescript
// Example: KR2 - Sleep & Mood Crisis
if (sleep.hours < 6 && sleep.quality < 60 && 
    (textSentiment.sentimentScore < -30 || textSentiment.stressIndicators > 75)) {
  // Fired: Combined physiological and psychological crisis detected
}
```

**Why rules instead of ML?**
- ✅ Fully explainable
- ✅ Easy to audit and modify
- ✅ No black-box predictions
- ✅ Domain knowledge encoded explicitly
- ✅ Fast, deterministic evaluation

### 3. Mock Data Generation (`utils/mockData.ts`)

Generates realistic, reproducible synthetic data:

```typescript
// Same date = same data (seeded randomness)
generateSystemStateForDate('2025-01-15')
// Returns complete system state with all modalities
```

**Modalities:**
- Sleep: Hours (4-10h) + quality (0-100%)
- Voice: Stress level + pitch stability + energy
- Facial: Fatigue + eye blink rate + asymmetry
- Biometrics: HR + HRV + stress + steps
- Text: Sentiment score + stress indicators + word count

---

## How to Use

### 1. View Today's Summary
1. Open the app → Dashboard appears
2. Read the disclaimer (toggle to accept)
3. Click "View Today's Summary"
4. Explore three tabs:
   - **Overview**: CHI score, contributions, sensor data, psychological state
   - **Rules**: Which rules fired and why
   - **Timeline**: Hourly events from sleep to interventions

### 2. Check Weekly Trends
- From Daily Summary, go back to Dashboard
- Click "View Weekly Summary"
- See 7-day CHI trend, risk distribution, top burnout drivers

### 3. Analyze Monthly Patterns
- Click "View Monthly Summary"
- See 30-day trends, longest low-risk streak, improvement %

### 4. Understand Your Results
Each screen explains:
- **Why** your CHI score is what it is
- **Which** data points contributed most
- **What** you can do about it

---

## Documentation

For deeper understanding of the system, see:

- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** – Complete feature breakdown and AI logic
- **[PHASE3_UPDATES.md](PHASE3_UPDATES.md)** – Recent enhancements: text sentiment integration, rules refactoring
- **[overview.md](overview.md)** – Original project overview and design vision

### Key Papers & References
The system demonstrates concepts from:
- **PEAS Framework** (Russell & Norvig, AI: A Modern Approach)
- **Explainable AI** (XAI) principles
- **Knowledge Representation** and rule-based reasoning
- **Multimodal AI** systems
- **Human-Centered AI** design

---

## Contributing

This is an **academic proof-of-concept** for a university AI course. Contributions for educational improvements are welcome:

### Guidelines
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make clear, focused commits
4. Push and open a Pull Request
5. Ensure TypeScript compilation passes: `npm run build`

### Areas for Contribution
- Additional visualization improvements
- Enhanced accessibility features
- Better mobile responsiveness
- More comprehensive error handling
- Documentation improvements

---

## Team & Acknowledgments

### Course Information
- **Subject**: SECJ3553 – Artificial Intelligence
- **Semester**: 1, 2025/2026
- **Section**: 07
- **Lecturer**: Dr. Ruhaidah Binti Samsudin
- **Institution**: Universiti Malaya

### Team Members
| Name | Matric # |
|------|----------|
| CHEW ZHUO HENG | A23CS0064 |
| GOH CHANG ZHE | A23CS0225 |
| OW YEE HAO | A23CS0261 |
| YAP JIA XIN | A23CS0199 |

### Technology Stack
- **Frontend**: React 19.2.3 + TypeScript 5.8.2
- **Build**: Vite 6.2.0
- **Visualization**: Recharts 3.6.0
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

---

## 📌 Disclaimer

⚠️ **IMPORTANT**: MindTrack is developed **solely for academic and learning purposes** as a proof-of-concept for explainable AI.

- ❌ **NOT a medical diagnostic tool**
- ❌ **NOT a substitute for professional mental health support**
- ❌ **All data is simulated** (no real sensor connections)
- ❌ **Should NOT be used for clinical decision-making**

If you or someone you know is struggling with mental health, please seek support from qualified professionals:
- National mental health hotlines
- Licensed therapists or counselors
- University health services
- Emergency services if needed

**MindTrack is a learning tool to demonstrate explainable AI concepts, nothing more.**

---

**Last Updated**: January 9, 2026  
**Status**: Academic POC - Ready for Assessment
