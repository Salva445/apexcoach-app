# APEXCOACH PRO — Improvements

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
