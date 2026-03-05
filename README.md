# Production Dashboard

A minimal production dashboard inspired by Studiobinder, focused on **any script or production you’re working on**. It includes:

- Home dashboard (recent activity, scripts, storyboard, moodboard, contacts, plans)
- Script writer with scene navigation and **Download to your PC** (plain text)
- Storyboard section with **aspect ratio** and **shot size / angle / movement** controls
- Moodboard with inline image uploads (stored in memory in the browser)
- Simple Contacts and Plans sections

This is built with **Vite + React + TypeScript** so you can deploy it easily to Render via GitHub.

## Getting started

From the `production-dashboard` folder:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Key sections

- **Home**: Overview of your workspace (recent activity, scripts, storyboards, moodboard, contacts, plans).
- **Scripts**: Scene-based script editor. Use the **Download script** button at the top right to save a `.txt` file to your computer.
- **Storyboards**: Strip view of shots with per-shot **aspect ratio**, **shot size**, **angle**, and **movement** pickers.
- **Moodboards**: Add reference images (PNG/JPEG etc.) from your machine; they show up in a Pinterest-style grid.
- **Contacts**: Table of your people (writer, DP, actors, producers).
- **Plans**: Simple production roadmap; click the status pill to cycle between *Not started → In progress → Done*.

## Deploying to Render

1. Commit this folder to a new GitHub repo.
2. On Render, create a new **Static Site**:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
3. Deploy. Render will serve the built React app.

You can tweak styling in `src/styles.css` or extend the React components in `src/App.tsx` as you grow the project.

