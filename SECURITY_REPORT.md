# APEXCOACH PRO: Security & Bug Report

**Scope:** `index.html` (the whole app), the GitHub Actions Android build (`.github/workflows/build-android.yml`) and the chat server setup (Supabase SQL).
**Method:** I read the code, tried to break each risky feature in a browser, and proved what I could (marked **Proven** below).

**Severity levels**

| Level | Meaning |
|---|---|
| **High** | Someone could steal data, run their own code in the app, or pretend to be you. |
| **Medium** | Real risk, but it needs physical access to the phone or unusual conditions. |
| **Low** | Privacy leaks, crashes, or hardening. |

## Summary

| # | Severity | Problem | Status |
|---|---|---|---|
| 1 | High | A booby-trapped backup file can run hidden code inside the app | Fixed |
| 2 | High | A chat invite code gives anyone who sees it permanent, full access to the chat | Fixed |
| 3 | High | Fake chat messages could be pushed straight onto the other phone, and live messages could be read by eavesdroppers | Fixed |
| 4 | High | Outside scripts loaded with no version pin or integrity check | Fixed |
| 5 | Medium | No Content Security Policy (nothing stops injected code from sending data away) | Fixed |
| 6 | Medium | GPS kept running after location permission was refused | Fixed |
| 7 | Medium | Android app data could be copied off the phone over USB or through backups | Fixed (partly; see notes) |
| 8 | Medium | No way to lock the app: anyone holding the unlocked phone sees photos, measurements and chats | Fixed (new PIN lock) |
| 9 | Low | CSV export can carry spreadsheet formulas ("CSV injection") | Fixed |
| 10 | Low | Privacy: Google Fonts and placehold.co saw your IP address on every launch | Fixed |
| 11 | Low | No limit on chat messages, so spam could use up the free server quota | Fixed |
| 12 | Low | A bad value in saved data crashes the Muscle screen | Fixed |
| 13 | Low | Backup files contain chat keys | Mitigated (warning) |
| 14 | Low | The "chat server" setting accepted any web address | Fixed |

**Location: checked and OK.** Precise GPS coordinates are only kept in memory while a run is active. They are never saved, never put in backups or CSV exports, and never sent anywhere. Saved runs keep only distance, pace, heart rate and the date. The Android app asks only for *foreground* location; there is no background tracking. That design was already good. Issue 6 was the only location bug.

---

## 1. High: a backup file can run hidden code (Proven)

**What:** *Settings → Restore JSON* loaded the file's contents straight into the app. Some values (exercise IDs, workout-plan durations, session counts and more) were then placed into the page as HTML or inside button code without being cleaned.

**Proof:** I made a backup file with:
- an exercise ID of `x');window.__pwned.push('exercise-id');('`
- a plan duration of `<img src=x onerror="…">`

After restoring it, both pieces of code ran. One ran as soon as the Muscle screen opened; the other ran when "remove exercise" was tapped.

**Why it matters:** Someone could send a "here's my training plan backup" file. When restored, hidden code could read everything in the app (measurements, photos, chats, chat keys) and send it to their server.

**Fix:**
- Every field of saved and restored data is now checked and cleaned. IDs must be simple letters/numbers, numbers must be real numbers, text is length-limited, and unknown values (themes, regions, muscles) fall back to defaults.
- Every value placed into the page or into button code is escaped.
- The new Content Security Policy (issue 5) blocks injected code from contacting any server except the chat server.

## 2. High: invite code = permanent full access to a chat

**What:** A chat room was protected only by its 12-character invite code. Anyone who saw the code once could, forever:
- read the whole conversation history;
- send messages as the coach **or** the client (the app simply trusted the "sender" the phone claimed);
- join from any number of extra phones.

The invite code is shared through WhatsApp, screenshots and so on, so it can easily leak.

**Fix (new server design, chat v2):**
- Each phone creates its own random 256-bit **device key** for each chat. It never leaves that phone except to the server, which stores only a SHA-256 hash of it.
- The coach's phone registers the room with its key.
- **The invite code is single-use.** The first client phone to join is locked in; any later phone using the same code is refused.
- The server decides who is coach and who is client from the key. A phone can no longer claim to be the other person.
- Reading history and sending messages both require a valid key. A leaked invite code is useless once the client has joined.

## 3. High: fake live messages, and live messages visible to eavesdroppers

**What:** For instant delivery, each phone broadcast the full message (text, sender name, role, ID) on a Realtime channel named after the room code. The receiving phone added whatever arrived on that channel straight into the conversation, without checking it with the server. So:
- anyone who knew the code could make any message appear on the other phone, from any name or role, and it was never stored anywhere;
- anyone listening on the channel could read messages as they were sent.

**Fix:**
- The broadcast now contains **no data at all**, just a "new message, check the server" signal.
- The channel name is a hash, not the room code.
- The app only ever displays messages loaded from the server with a valid device key.
- Checks are throttled, so spamming the signal does nothing.

## 4. High: unpinned outside scripts with no integrity check

**What:**
- `https://cdn.tailwindcss.com` always served the latest version.
- `@supabase/supabase-js@2` floated to whatever 2.x was newest. Version tags like `999.9.2-canary.0` exist on that package, which shows how loosely versions are published.

Neither had an integrity hash. If the CDN or the package were ever compromised or simply changed, the new code would run with full access to all app data.

**Fix:** Both libraries are now bundled inside the app at fixed, known versions:
- Tailwind Play 3.4.17, sha384 `igm5BeiBt36UU4gqwWS7imYmelpTsZlQ45FZf+XBn9MuJbn4nQr7yx1yFydocC/K`
- supabase-js 2.118.0, sha384 `TcHRA3zBbn+Lexh5n+Oil4guNPOS3rjNDpGRAN46u/s/mB2IZ50ceC6TYDU2yvgK`

They load from the app's own `vendor/` folder with integrity checks. The Android build workflow now copies `vendor/` into the APK. Bonus: the app now works offline.

## 5. Medium: no Content Security Policy

**What:** Nothing limited what the page could load or contact. Any injected code could send data anywhere.

**Fix:** A strict policy is now built in:
- scripts only from the app itself;
- network connections only to `*.supabase.co`;
- images only from the app, your own photos and the exercise-demo image host;
- no plugins, frames or forms posting elsewhere;
- referrer sending turned off.

## 6. Medium: GPS kept running after location permission was refused

**What:** If you refused location permission (or turned it off mid-run), the location watcher stayed registered and the run carried on counting time with zero distance until you pressed Stop. The wake lock also kept the screen on.

**Fix:**
- When permission is denied, the run stops cleanly: the watcher is removed, the wake lock is released and the timer is stopped, with a clear message.
- Coordinate history is also capped so very long runs can't fill up memory.

## 7. Medium: app data could be copied off an Android phone

**What:**
- The APK allowed Android backups (`allowBackup` defaults to on), so app data, including chat keys, could be pulled with `adb backup` or end up in cloud backups.
- It's a *debug* build with WebView debugging on, so anyone with the phone over USB could inspect all app storage.

**Fix:**
- The workflow now sets `android:allowBackup="false"` and `android:fullBackupContent="false"`.
- WebView debugging is turned off in the Capacitor config.

**Still needed from you:** a properly signed release build. That needs a signing key that only you hold, stored as a GitHub secret. Until then the APK is still a debug build.

## 8. Medium: no app lock

**What:** All data (body measurements, progress photos, chats) opens to anyone who picks up the unlocked phone.

**Fix:** a new optional **PIN lock** (*Settings → App lock*).
- **PIN:** 4–8 digits, stored only as a PBKDF2-SHA-256 hash (150,000 rounds, random salt).
- **Wrong attempts:** after 5 wrong tries, increasing waits (30 s, then 1 min, 2 min, …), which survive closing the app.
- **Auto-lock:** after 1 minute in the background.
- **Changing it:** changing or removing the PIN requires the current PIN.

**Honest limit:** this is a lock screen, not encryption. Someone with root access or the debug tools from issue 7 could still read the stored data.

## 9. Low: CSV injection

**What:** Exercise names and run names went into the CSV unchanged. A name starting with `=`, `+`, `-` or `@` (for example `=HYPERLINK(…)`) runs as a formula when the CSV is opened in Excel or Google Sheets.

**Fix:** Such cells are now prefixed with `'`, so they show as plain text.

## 10. Low: privacy leaks to third parties

**What:**
- On every launch the app loaded fonts from Google (Google sees your IP address and when you use the app; under EU/GDPR rules this needs consent).
- The default progress photos came from placehold.co.

**Fix:**
- Fonts are bundled (Latin only, 284 KB).
- Placeholder photos are drawn inside the app.
- The only outside requests left are the exercise demo images. They're loaded only when you open a demo, carry no personal data, and are now pinned to a fixed version of their source (`free-exercise-db@f00c92c`) instead of a moving branch.

## 11. Low: no chat rate limit

**What:** Anyone could flood a room with messages and use up the free Supabase quota.

**Fix:**
- The server refuses more than 30 messages per minute per room.
- Message, name and room sizes are capped.
- The app slows its own retries.

## 12. Low: bad saved values crash screens (Proven)

**What:** A saved `selectedRegion` that isn't a real region made the Muscle screen throw `Cannot read properties of undefined (reading 'label')`.

**Fix:** Covered by the data cleaning in issue 1.

## 13. Low: backups contain chat keys

**What:** A JSON backup lets you restore your chats on a new phone, so it has to contain the device keys. Anyone holding the file could use your chats.

**Fix:** The export now shows a clear warning to keep the file private. Keys are needed for restoring, so they're still included.

## 14. Low: the chat-server setting accepted any address

**What:** *Chat server (advanced)* accepted any URL, so a person could be talked into sending their room codes and keys to a look-alike server.

**Fix:** Only `https://<project>.supabase.co` addresses are accepted. The security policy blocks anything else too.

---

## How the fixes were tested

All tests ran in a browser against the fixed app.

| Test | Result |
|---|---|
| Booby-trapped backup (issue 1) restored again | No code ran, the Muscle screen no longer crashes, bad values fell back to defaults |
| PIN lock: set (with a mismatch first), reload, 5 wrong tries, correct PIN during the wait, unlock, remove with a wrong PIN, then with the right one | All behaved as designed; the PIN never appears in storage and isn't in backups |
| Chat v2 against a stand-in server that follows the same rules as `supabase/chat_schema.sql` | Coach room registered; the server stores only key hashes; roles set by the server |
| Chat: a second phone or attacker with the leaked invite code | Refused for join, history and sending; the app shows "code invalid or already used" |
| Chat: forged broadcast with fake message text | Ignored; only server messages are shown |
| Chat: broadcasts | Contain no message text; the channel name doesn't reveal the code |
| Chat: 31st message in one minute | Refused (rate limit) |
| GPS: location permission refused mid-run | Run stopped, location watcher removed, wake lock released |
| Bundled libraries | Integrity hashes verified locally; the Android build now fails if they don't match |

**Not tested yet:** the real Supabase server (it needs your project) and the APK on a real phone.
