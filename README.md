# PortfolioKul 🚀

A polished portfolio website built with **Angular 21**, **Tailwind CSS**, and **animated theme transitions**.

## ✨ What makes it special

- 🦇 **Batman-inspired theme** with dark accents, neon highlights, and glowing hero effects
- 🌓 **Theme toggle** with a bat icon that triggers a screen-wide animation before switching styles
- 🍃 **Smooth transitions** for colors, backgrounds, and layout changes
- 📱 **Responsive navigation** for mobile and desktop screens
- 🚀 Built with Angular standalone components and modern CSS variables

## 🧩 Tech stack

- Angular 21
- Tailwind CSS
- TypeScript
- Typed.js
- PostCSS

## 📁 Project structure

- `src/app/` — Angular application files
- `src/app/shared/` — shared layout components like navbar
- `src/app/sections/` — page sections like hero, about, skills, projects
- `src/styles.css` — theme variables, tailwind base styles, transition helpers
- `tailwind.config.js` — custom Tailwind theme and utilities
- `src/app/shared/navbar/navbar.ts` — bat animation + theme toggle logic

## 🚀 Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:4200
```

## 🛠 Build for production

```bash
npm run build
```

## 🧪 Run tests

```bash
npm test
```

## 🎯 Notes

- The theme toggle is intentionally delayed to let the bat animation complete before the page style changes
- The nav links scroll smoothly between sections without triggering the bat animation

## 💡 Want to customize?

- Edit `src/styles.css` to change the color palette
- Edit `src/app/shared/navbar/navbar.ts` to tune bat animation speed and motion
- Edit `src/app/sections/hero/hero.css` for hero section visuals

---

Made for a stylish developer portfolio with a bold animated theme switcher. 🧨