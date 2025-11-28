# Upnova – Multi Task Workspace

This repository bundles three self‑contained tasks that showcase different parts of the Upnova codebase:

| Task            | Stack                             | Highlights                                                               |
| --------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `upnova-task-1` | Node.js                           | Cart Chain Event Manager with mock Shopify cart + runnable test harness. |
| `upnova-task-2` | React 19 + Vite + Tailwind        | Animated OTP input component using the new `useEffectEvent` API.         |
| `upnova-task-3` | Next.js 16 + CopilotKit + Zustand | Dark themed Todo workspace paired with an AI sidebar.                    |

> **Prerequisites:** Node.js ≥ 18 and npm (or pnpm/bun). Each task lives in its own folder; install dependencies and run commands from there.

---

## Task 1 – Cart Chain Event Manager (`upnova-task-1`)

- Plain Node.js module implementing `CartChainEventManager`.
- Includes mock cart APIs plus two sample chain events (auto add gift + sync attributes).
- A complete test script runs when you execute `node index.js`.

**Quick start**

```bash
cd upnova-task-1
node index.js
```

You’ll see the fake cart before/after the chain along with logging for each event in the sequence.

---

## Task 2 – OTP Input Demo (`upnova-task-2`)

- React 19.2, Vite, TailwindCSS, Motion (motion.dev).
- Custom 6-digit OTP UI with animated focus ring, shake-on-error, lock success state, and proper `useEffectEvent` usage.

**Install & run**

```bash
cd upnova-task-2
npm install
npm run dev
```

Open the Vite dev server that appears in your terminal (default: <http://localhost:5173>).

---

## Task 3 – Copilot Todo Workspace (`upnova-task-3`)

- Next.js App Router project featuring:
  - Modern dark-themed Todo list (Zustand for state + persistence).
  - Right-hand CopilotKit Sidebar for natural language interactions.
  - Responsive layout (`flex h-screen`) with independent scroll regions.

**Install & run**

```bash
cd upnova-task-3
npm install
npm run dev
```

Visit <http://localhost:3000>. The left panel hosts the todo workflow while the fixed `w-[350px]` sidebar embeds the Copilot chat.

### ⚠️ Hydration Error Notice (Important)

If you see a warning like:

```text
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

**This is not caused by the code.** It happens because some browser extensions inject custom attributes into `<input>` and `<textarea>` elements (e.g., `data-prompt-manager-attached="true"`). These extensions (AI assistants, writing helpers, form enhancers, etc.) modify the DOM before React hydrates, which triggers hydration mismatch errors.

**✅ Recommended Solution:** Run the project in an **Incognito / Private window**. Incognito does not load most extensions, so hydration works correctly.

**Alternative Options:**

- Disable extensions that modify inputs (Grammarly, LanguageTool, AI prompt helpers, etc.)
- Ignore the warning using `suppressHydrationWarning` (not recommended unless necessary)
---

## Project Tips

- Each task keeps its own `package.json`, ESLint, and tooling—no hoisted dependencies.
- Use your preferred package manager, but stay consistent per task (all lockfiles currently use npm).
- For linting, run `npm run lint` inside the respective folder.

Feel free to dive into any task independently—each directory is production-ready and documented through inline comments and discoverable code. Happy hacking!
