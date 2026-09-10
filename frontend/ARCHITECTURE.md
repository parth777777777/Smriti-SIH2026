# Smriti Frontend Structure

The original Figma Make export kept the entire UI in one `src/app.tsx`. This version separates the app by responsibility so gameplay/telemetry work can be added without editing one giant component.

## Structure

```text
src/
├── App.tsx                         # app state + screen routing only
├── types.ts                        # shared TypeScript types
├── data/
│   └── content.tsx                # themes, game content, generators, shared constants
├── components/
│   ├── common.tsx                 # StatusBar, BackBtn, SpeakerBtn, BottomNav
│   └── illustrations.tsx          # reusable SVG illustrations + NER background
├── screens/
│   ├── onboarding.tsx             # splash, role selection, elder setup
│   ├── home.tsx                   # elder home + care/settings tabs
│   ├── memory-recall.tsx          # Memory Recall flow
│   ├── grocery-recall.tsx         # Grocery Recall flow
│   └── caregiver.tsx              # caregiver setup + dashboard
├── games/
│   └── memory-match.tsx           # Memory Match gameplay + result screen
└── assets/
    └── reference/                 # imported Figma screenshots; not runtime dependencies
```

## Important finding about the imported PNGs

`image-1.png` and `image-2.png` are **not imported or referenced by the React code**. They are screenshots/reference assets of the splash screen. The actual splash UI is rendered with React + inline SVG (`ElderlyWomanIllustration`). They have therefore been moved to `src/assets/reference/` rather than treated as application dependencies.

## Where telemetry should go

For the next step, telemetry should be added at the screen/game boundaries instead of inside `App.tsx`:

- `games/memory-match.tsx` — card taps, matches, mismatches, moves, completion time
- `screens/memory-recall.tsx` — object selection, accuracy, response time, completion
- `screens/grocery-recall.tsx` — item selection, accuracy, response time, completion
- `screens/caregiver.tsx` — care updates / monitoring actions

The backend can then receive a normalized event payload without the UI components knowing whether the destination is Express/Node, local SQLite, or another transport.
