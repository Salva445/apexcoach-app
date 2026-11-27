# ApexCoach on iPhone

iPhones work differently from Android. An Android phone can install an `.apk` file you send it. **An iPhone only installs apps signed by Apple**, so there's no "just send the file" option. There are three ways to get ApexCoach onto an iPhone:

| Way | Cost | Who can install | Effort |
|---|---|---|---|
| **1. Sideload with your Apple ID** | Free | You (and anyone you help, on their own computer) | About 10 minutes; re-sign every 7 days |
| **2. TestFlight / App Store** | Apple Developer Program, about 99 €/year | Up to 10,000 testers, or everyone on the App Store | One-time setup, then it updates by itself |
| **3. Home-screen web app** | Free (needs hosting) | Anyone with Safari | They open a link and tap "Add to Home Screen" |

All three use exactly the same app as Android. Only the iPhone-specific parts change (below).

---

## 1. Sideload the IPA with your Apple ID (free)

Each time the app changes, GitHub builds **`ApexCoach-unsigned.ipa`**. Find it in the repo's **Actions** tab → **Build APEXCOACH iOS app** → the latest run → **Artifacts** → `apexcoach-ios-unsigned-ipa`. It downloads as a zip; unzip it to get the `.ipa`.

You can't install that file directly; it has to be signed first. Sideloadly does that for free with your own Apple ID.

1. On a Windows PC or Mac, install **iTunes** (Windows: get it from apple.com, not the Microsoft Store) and **Sideloadly** (sideloadly.io).
2. Connect the iPhone with a cable and tap **Trust** on the phone.
3. Open Sideloadly, drag in `ApexCoach-unsigned.ipa`, enter your Apple ID, and click **Start**.
4. On the iPhone, go to **Settings → General → VPN & Device Management**, tap your Apple ID, then **Trust**.
5. On iOS 16 or newer, turn on **Settings → Privacy & Security → Developer Mode** and restart when asked.

Limits of free Apple IDs: the app stops opening after **7 days** until you sign it again (your data stays), and you can have at most 3 sideloaded apps. AltStore (altstore.io) can re-sign automatically over Wi-Fi.

## 2. TestFlight and the App Store (for sharing with lots of people)

1. Join the **Apple Developer Program** (developer.apple.com) with an Apple ID.
2. In **App Store Connect**, create an app with the bundle ID **`com.apexcoach.pro`**.
3. Send me (Claude) a message when that's done. I'll add a signing step to the build that uploads each new version to TestFlight. You'll need to add your signing certificate and an App Store Connect API key as GitHub secrets; I'll walk you through it. Never paste those into a chat.
4. Invite testers by email or a public TestFlight link. They install the free **TestFlight** app and tap **Install**. Updates arrive automatically.

App Store review needs a privacy policy URL and a short description. App permissions are already explained to the user (see below).

## 3. Home-screen web app (free, no Apple account)

The app is also a full "web app": it has an icon, opens full-screen without Safari's toolbars, and works offline. It just needs to be hosted at an `https://` address.

- **To host it:** free options include Cloudflare Pages, Netlify or Vercel. Upload `index.html`, `manifest.webmanifest`, `sw.js`, `vendor/` and `icons/`. GitHub Pages also works while the repo is public.
- **To install it:** open the link in **Safari** → tap **Share** → **Add to Home Screen** → **Add**.

Limits of the web-app version: no Taptic haptics, and no Bluetooth (same as the native iPhone app). Everything else works the same, including accounts, the leaderboard and chat.

---

## What's different on iPhone

| Feature | Android | iPhone |
|---|---|---|
| **Vibration** | Phone vibration | **Taptic Engine** taps (light, medium, heavy, and a "success" buzz) through Capacitor Haptics |
| **Exporting** (CSV, backup, PR card) | Saves a file | Opens the **share sheet**: Save to Files, AirDrop, Messages, WhatsApp… |
| **Typing** | Normal | Text fields use 16 px text, so Safari doesn't zoom in when you tap them |
| **Notch / Dynamic Island / home bar** | Normal | Pop-ups, the lock screen and messages keep clear of them |
| **Bluetooth heart-rate straps** | Supported | Not allowed by Apple in web apps; the app says so and uses the simulator |
| **Permission pop-ups** | Android standard | Each one explains why: location (only while recording a run, never saved), microphone and speech (only when you tap Voice), camera and photos (only for progress photos) |
| **Icon and launch screen** | Default | ApexCoach icon and a dark launch screen in the app's colours |
| **Status bar** | Default | Light text on the dark app |

**Tip:** the iPhone's ring/silent switch mutes the app's sound effects. Switch it to ring if you want the reward sounds.
