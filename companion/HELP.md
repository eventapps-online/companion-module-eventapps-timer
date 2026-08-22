## EventApps Countdown Timer

Control the EventApps Timer countdown from Companion and mirror its output —
time and colours — on your Stream Deck, over the app's built-in HTTP server.

### Configuration

- **Timer IP** — the IP address of the machine running EventApps Timer.
  Use `127.0.0.1` when Companion runs on that same machine.
- **Port** — `8080` (fixed).
- **Control token** — the part after `/control-` in the remote-control address.
  Open the app's QR code window (the button that shows the control QR); the
  address shown there ends with `/control-<token>`. Generating a new token in
  that window means the token has to be updated here as well.
- **Poll interval** — how often Companion reads the state for variables and
  feedbacks. `250` ms keeps the button time in step with the output.

### Network setup

The app serves localhost out of the box. To reach it from another machine
(Companion on a different computer), enable network access in the app from its
status bar — Windows asks for elevation once and the app registers the URL
reservation and firewall rule for you. The status bar then shows the LAN
address to use as **Timer IP**.

### What it does

- **Actions**: SET + START, START/PAUSE, PAUSE, show the clock, next cue,
  ±1 minute, set the countdown time in seconds, and start a specific cue
  picked from a dropdown.
- **Variables**: `time` (the text currently on the output, including speaker
  messages), `set_time` (the time the next run will start from),
  `start_label`, which switches between `START COUNTDOWN`, `PAUSE COUNTDOWN`
  and `SHOW COUNTDOWN` so one button can carry the right caption, and `clock`
  (the local time of day of the machine running Companion).
- **Feedbacks**: _Output colours_ takes over the background and text colour of
  the output window, so the button turns amber/red with the countdown events;
  plus boolean feedbacks for _countdown is running_ and _output shows the
  countdown_.
- **Presets**: ready-made buttons in the **Timer** section, a **Set time**
  section with 3/5/10/15/30/60 minutes, and one button per cue.

### Notes

- The cue dropdown and the cue presets list the cue **names**; the underlying
  UUID is stored invisibly and stays stable across edits and restarts. The list
  refreshes automatically when cues are changed in the app.
- Starting a cue does nothing while cues are switched off in the app.
- A `Wrong or missing control token` status means the token above does not
  match the one in the app's QR window.
