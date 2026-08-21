# companion-module-eventapps-timer

A [Bitfocus Companion](https://bitfocus.io/companion) module for **EventApps
Timer** (Countdown Timer) — drive the countdown from a Stream Deck and mirror
the timer output on the buttons, over the app's built-in HTTP server.

## Setup

1. In EventApps Timer: open the QR code window and copy the token — the part
   after `/control-` in the control address. If Companion runs on another
   machine, enable network access from the app's status bar first (one-time
   Windows elevation).
2. In Companion: add the **EventApps: Countdown Timer** connection and fill in
   the timer machine's IP (`127.0.0.1` when local), the port `8080` and the
   token.

## What it does

- **Actions**: SET + START, START/PAUSE, PAUSE, show the clock, next cue,
  ±1 minute, set the countdown time in seconds, and start a cue by name.
- **Dropdowns** show the cue **names** (the UUID is hidden) and refresh
  automatically when the cue list changes in the app.
- **Feedbacks**: take over the output background/text colours so the button
  follows the countdown events, plus booleans for _running_ and _output shows
  the countdown_.
- **Variables**: `time`, `set_time` and `start_label` (START / PAUSE / SHOW
  COUNTDOWN, following the current state).
- **Presets**: ready-made buttons for the output mirror, clock, START, the
  state-driven START/PAUSE button, PAUSE, ±1 MIN and NEXT CUE, a **Set time**
  section with 3/5/10/15/30/60 minutes, and one button per cue.

## Build

This module uses Yarn 4 (via Corepack) and Node 22.

```
corepack enable
yarn install
yarn build          # -> dist/main.js
yarn lint
```

Load it in Companion via **Developer modules path** pointed at the folder that
contains this one.

## Protocol

Plain HTTP against the timer: `GET /state` for feedback (polled, default
250 ms), and `GET /set`, `/start`, `/pause`, `/clock`, `/next`, `/up`, `/down`,
`/settime?s=`, `/cue/go?id=` for commands. The token is sent as the
`X-Auth-Token` header.
