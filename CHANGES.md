# APEXCOACH PRO — Improvements

# Round 4: a more human design

The app felt "made by a robot": ALL-CAPS typewriter text, tiny labels, sci-fi words ("Command deck", "Telemetry"), cut-corner panels with scanlines, and emoji as icons. This round keeps the features but changes how the app looks and talks.

- **Friendly type:** the rounded *Outfit* font (bundled, works offline), sentence case everywhere instead of capitals, and readable minimum text sizes.
- **Soft shapes:** big rounded cards, pill-shaped buttons, a warm forest-green background glow, and no more grid, scanlines or corner brackets.
- **Line icons** in the bottom bar, and a raised round "+" button.
- **A coach that talks to you:**
  - Home greets you by name with the time of day ("Good afternoon, Rita 👋") and shows your initials as an avatar.
  - One plain-words line about today ("Train today to keep your 3-day streak").
  - The coach card explains why, from your sleep, resting heart rate and soreness, instead of jargon like "neuromuscular window".
- **Today's focus:** one suggestion with a Start button (for example "Your upper body is ready · 93% recovered · 45 min").
- **This week:** the days you trained get a ring.
- **Choose your workout:** Strength / Cardio / Warm-up / Core chips with photo cards from the public-domain exercise library.
- **Recent activity** with your last workouts and runs.
- **One clear readiness number** with a word that describes it (Fresh / Steady / Take it easy).
- Every screen except Home now has a short title and an explanation instead of the big header.

# Round 3: security

See SECURITY_REPORT.md.


# Round 2

## New futuristic look
- Panels have angled, cut corners with glowing diagonal edges, an accent sweep along the top and a corner bracket, instead of plain rounded boxes.
- Tiles and buttons have notched corners. The main buttons are angled "blades" with a light sweep when you hover over them.
- The background has a faint tech grid and soft scanlines. Headings use the Chakra Petch font with a glowing accent tick.
- The bottom dock has a glowing indicator on the active tab and a hexagonal "+" button.

## Readiness rings
- Fixed the "READINESS" label overlapping the inner red ring: the rings are thinner and spaced further out, so the label and number always fit inside.
- Added a slowly rotating tick dial around the rings, and a soft glow on each ring.

## Muscle map
- Redrawn front and back figures with separate muscle heads:
  - Front: upper, middle and lower abs plus the lower V-line, obliques, chest, front delts, upper traps, biceps, forearms, the 3 quad heads, adductors, tibialis and calves.
  - Back: the full trapezius diamond, rear delts, infraspinatus, lats, lower back, triceps, gluteus medius and maximus, both hamstrings, both calf heads and the soleus.
- Each side is drawn once and mirrored, so the figure is perfectly symmetrical. There are subtle muscle-fibre lines, and a labelled load legend (low / medium / high).

## Sound effects
- A louder sound engine with a compressor and a short echo. The volume levels are now Low / Medium / Loud.
- **Combo rewards:** each positive action within 6 seconds (a set, water, protein, calories) plays a chime one step higher on a musical scale.
- **"Level up" sound** when you finish a workout, a run, a fitness test, HIIT or a warm-up: a bass drop, a fast rising arpeggio, a chord and a sparkle tail. PRs get a bigger fanfare.
- A glowing ring bursts from whatever you tapped. Settings has a button to preview the reward sound.

## Settings
- The sound, theme, language and unit buttons moved from the top bar into Settings, along with a "Your name" field (shown at the top of the home screen).

## Chat between devices
- The demo clients (Marcus, Sofia, Daniel) and their fake messages are removed.
- **Coach:** tap "+ Add client" to get a private invite code, then share it.
- **Client:** on their own phone, tap "Join a coach" and type the code.
- Messages go through a Supabase server. History is saved there, messages arrive live, the app checks again every 15 seconds and when you reopen it, and failed messages are resent automatically. Includes unread counts, sending a workout plan, and removing a chat.
- Security: the public key can only call two database functions (send / read history for one room code). It can't list or read other rooms.

## European Portuguese
- Everything has a pt-PT version: every screen, popup message, button, setting, date and month, and all 81 exercises (names, tips and step-by-step instructions) plus the 30 warm-up and cool-down drills.
- Brazilian wording was replaced with European Portuguese (e.g. "registar", "guardar", "ecrã", "gémeos", "isquiotibiais", "a decorrer").

# Round 1

## Daily tracking & dates
- **Daily counters now reset at midnight.** Calories, water, protein and steps used to keep piling up forever. The app now notices a new day (on launch, every minute, and when you reopen it) and resets them, and the 7-day burn chart moves forward one day.
- **The 7-day chart shows real weekdays.** The labels were always MON…SAT, TODAY, whatever day it actually was.
- **Real dates everywhere.** Runs, body measurements and fitness tests were saved with the text "Today" / "Just now", so they said "Today" forever, and "Dist Today" kept counting old runs. They now store the actual date and show "Today", "Yesterday", "3 days ago" or "Nov 4".
- **Fixed a time-zone bug.** Workouts logged in the late evening or early morning could land on the wrong calendar day, because dates were worked out in UTC instead of local time.
- **The streak is calculated.** It was a fixed number (18) that went up by 1 per workout, so two workouts in one day counted as +2, and it never broke. It now counts the consecutive days with a logged workout or run.
- **The monthly distance challenge uses your real runs.** It was hard-coded ("November", 38.4 / 50 mi, made-up leaderboard). It now shows the current month and the distance you actually logged, in miles or km.
- Existing saved data is upgraded automatically on first launch (old "Today" entries get pinned to the last day the app was used).

## Timers that don't lose time
- The rest timer, HIIT/Tabata timer, GPS run clock, live workout clock and fitness-test clock now work from the real clock instead of counting ticks. Phones slow down or pause timers when the screen locks, so the old timers ran behind. HIIT also catches up through any rounds that passed while the screen was off, and pausing keeps the exact second.
- The screen wake lock is requested again when you come back to the app during a GPS run (the phone drops it when the app goes to the background).

## Live guided workouts
- **Enter weight and reps for every set.** The live session used a placeholder weight (95 lb, or 135 lb for bodyweight moves) and you couldn't change it, so the volume numbers were made up. Each set now records exactly what you lifted, and the set buttons show it (e.g. `✓ SET 2 · 230×6`).
- **Sessions survive closing the app.** A workout in progress is saved, so a reload, app switch or Android closing the app in the background no longer loses it.
- **Finishing updates your Strength Logger.** Your heaviest set of each exercise goes into its history, new PRs are detected and celebrated, and exercises added by the session get real numbers instead of the 95 lb placeholder.
- Finishing with zero sets no longer saves a fake session (it used to invent 1,250 lb of volume). Discarding a session with completed sets, or starting a new one on top of it, now asks you first.
- Un-ticking a set now also takes back its calories.

## Fixes
- **Progress photos are kept.** Uploaded photos were saved as temporary links that stopped working after a reload. They're now shrunk (max 900 px JPEG) and saved properly. If the device runs out of storage you get a warning instead of silently losing data.
- Exercise names containing quotes (e.g. `Bob's "Crazy" Press`) no longer break their Demo / Log buttons.
- A chat message coming from Supabase could no longer inject code through its plan ID.
- The chat unread badge now clears when you open the Chat tab.
- "Reset demo" also clears any live session in progress.
