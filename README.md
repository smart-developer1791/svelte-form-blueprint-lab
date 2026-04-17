<div align="center">

# ✦ Formline

**Svelte form blueprint studio with a live schema editor, animated field reordering, and reactive preview modes**

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

*A compact Svelte pet project built to demonstrate schema-driven UI the way Svelte makes it feel best: change the structure in the blueprint, tweak a field in the inspector, and watch the preview recompute instantly from the same state.*

</div>

---

## ✨ Highlights

- Bright editorial studio layout instead of another dark control dashboard
- Schema-first blueprint board with editable sections and field cards
- Live inspector bound to the selected field for label, type, helper, width, and options
- Reactive preview with `Mobile`, `Desktop`, and `Confirm` states fed by the same blueprint
- `animate:flip` list motion for field and section reordering
- Tailwind CSS 4 as the styling base with a very small global theme layer
- Static Vite setup with Netlify-ready deployment

---

## 🧭 Scope

- `/` - the Formline form blueprint studio

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Svelte 5 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + minimal theme layer |
| Motion | `animate:flip`, keyed transitions, reactive preview swaps |
| Build Tool | Vite 8 |
| Hosting | Static deployment ready |

---

## 🧱 Architecture

- `FieldPalette` handles presets, quick field insertion, and live schema metrics
- `BlueprintList` owns the editable section and field board with animated reordering
- `FieldEditor` binds directly to the selected field so changes appear in the preview immediately
- `LivePreview` renders multiple interface states from the exact same blueprint data

---

## 🗂️ Project Structure

```text
svelte-form-blueprint-lab/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.svelte
│   ├── app.css
│   ├── main.ts
│   ├── vite-env.d.ts
│   └── lib/
│       ├── BlueprintList.svelte
│       ├── FieldEditor.svelte
│       ├── FieldPalette.svelte
│       ├── LivePreview.svelte
│       ├── PreviewField.svelte
│       ├── types.ts
│       └── data/
│           └── presets.ts
├── LICENSE
├── netlify.toml
├── package.json
└── README.md
```

---

## 🚀 Local Development

### 📦 Install

```bash
npm install
```

### ▶️ Run dev server

```bash
npm run dev
```

### 🏗️ Build

```bash
npm run build
```

---

## 🌐 Deployment

### 🌐 Netlify (Recommended)

1. Push your code to GitHub
2. Connect repository to Netlify
3. Build settings are auto-configured via `netlify.toml`
4. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## 📄 License

MIT License. See `LICENSE`.
