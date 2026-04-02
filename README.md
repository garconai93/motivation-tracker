# 🔥 MotivationTracker

A personal daily motivation and mood tracking web app for **Siro** — built with vanilla HTML, CSS, and JavaScript, deployed on GitHub Pages.

## ✨ Features

- **📅 Daily Mood Logging** — Rate your day 1–10 with a visual slider and emoji faces
- **🌅 Morning Check-in** — Set your intentions for the day
- **🌙 Evening Reflection** — Journal what went well and what you learned
- **🔥 Streak Tracking** — Consecutive productive days counter
- **📊 Weekly Analytics** — Chart.js-powered mood line graph over the last 7 days
- **💬 Motivational Quotes** — Random inspiration with one-click refresh
- **🎯 Goal Setting** — Up to 3 active goals with progress tracking
- **🌓 Dark/Light Theme** — Toggle between dark-first and light modes
- **💾 LocalStorage** — All data persists locally in your browser

## 🚀 Live App

**https://garconai93.github.io/motivation-tracker/**

## 🛠️ Tech Stack

- Vanilla HTML5, CSS3, JavaScript (ES6+)
- [Chart.js v4](https://www.chartjs.org/) via CDN for mood analytics
- [GitHub Pages](https://pages.github.com/) for hosting
- No frameworks, no build tools, no dependencies to install

## 📂 Project Structure

```
motivation-tracker/
├── docs/
│   ├── index.html    # Main app (HTML structure)
│   ├── styles.css    # All styles + CSS variables for theming
│   └── app.js        # App logic, state management, LocalStorage
└── README.md
```

## 🎨 Design

- **Dark-first** modern UI with card-based layout
- Emoji-driven icons throughout
- Fire emoji 🔥 for streak counter with glow animation
- Mood slider with 10 expressive emoji faces
- Smooth transitions and hover states
- Fully responsive (mobile-friendly)

## 📖 Usage

1. Open the [live app](https://garconai93.github.io/motivation-tracker/)
2. Log your daily mood with the slider
3. Write a morning check-in and evening reflection
4. Set up to 3 goals and check them off as you complete them
5. Watch your streak grow as you log consecutive days
6. Check the weekly chart to see your mood trends
7. Toggle between dark and light themes anytime

All data is stored in your browser's LocalStorage — no account needed.

## 🔧 Deploy

The app deploys automatically from the `master/docs` branch via GitHub Pages.

To deploy your own version:
1. Fork this repo
2. Go to **Settings → Pages**
3. Set Source to `master` / `docs` folder
4. Your app will be live at `https://<username>.github.io/<repo>/`

---

Built with 💜 for Siro
