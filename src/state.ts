// Shape of GET /state returned by EventApps Timer (see companion-modules/API-CONTRACT.md).

export interface CueEntry {
	id: string
	name: string
	seconds: number
}

export interface TimerState {
	app: string
	version: string
	mode: string // "countdown" | "clock" - what the output currently shows
	running: boolean // countdown actually counting
	message: boolean // speaker message shown on the output
	display: string // exact output text (mirrors the output window)
	bg: string // output background colour, "#RRGGBB"
	fg: string // output text colour, "#RRGGBB"
	setTimeSeconds: number
	setTimeLabel: string
	remainingMs: number // frozen while not running (pause keeps it for resume) - interpret with "running"
	cueMode: string // "man" | "auto" | "off"
	cueRepeat: boolean
	cueSubzero: boolean
	activeCueId: string // cue currently in PGM; "" if none or cues off
	nextCueId: string
	cues: CueEntry[]
}

export function emptyState(): TimerState {
	return {
		app: 'eventapps-timer',
		version: '',
		mode: 'clock',
		running: false,
		message: false,
		display: '',
		bg: '#000000',
		fg: '#FFFFFF',
		setTimeSeconds: 0,
		setTimeLabel: '',
		remainingMs: 0,
		cueMode: 'off',
		cueRepeat: false,
		cueSubzero: false,
		activeCueId: '',
		nextCueId: '',
		cues: [],
	}
}

// Signature of the cue LIST (ids + names). When it changes we rebuild the
// dropdown choices so the module follows edits made in the app.
export function listSignature(s: TimerState): string {
	return JSON.stringify(s.cues.map((c) => [c.id, c.name]))
}

// State-dependent label for the START button, as suggested by the API contract:
// clock on the output -> SHOW COUNTDOWN (no matter whether it runs underneath),
// otherwise PAUSE / START COUNTDOWN.
export function startLabel(s: TimerState): string {
	// COUNTDOWN split over two lines - on one line it forces a tiny font on 72px buttons
	if (s.mode === 'clock') return 'SHOW\nCOUNT\nDOWN'
	return s.running ? 'PAUSE\nCOUNT\nDOWN' : 'START\nCOUNT\nDOWN'
}

// Choice label for a cue: its name plus the countdown length when they differ
// (cue names are often the time itself, e.g. "15:00").
export function cueLabel(c: CueEntry): string {
	const time = fmtClock(c.seconds * 1000)
	return c.name && c.name !== time ? `${c.name} (${time})` : time
}

// milliseconds -> "m:ss"
export function fmtClock(ms: number): string {
	if (!isFinite(ms) || ms < 0) ms = 0
	const total = Math.floor(ms / 1000)
	const m = Math.floor(total / 60)
	const s = total % 60
	return m + ':' + String(s).padStart(2, '0')
}
