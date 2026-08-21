import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import type TimerInstance from './main.js'
import type { TimerSchema } from './main.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const DARK = combineRgb(27, 32, 38)
const RED = combineRgb(160, 0, 0)
const GREEN = combineRgb(0, 160, 70)
const ACCENT = combineRgb(92, 159, 224)

const CENTER = 'center:center' as const

// Proven on real desks: label on the first line, time on the second, size 18.
const LABEL_SIZE = '18'

export interface TimerPresets {
	structure: CompanionPresetSection<TimerSchema>[]
	presets: CompanionPresetDefinitions<TimerSchema>
}

const QUICK_TIMES = [
	{ id: 'set_3min', label: '3 MIN', seconds: 180 },
	{ id: 'set_5min', label: '5 MIN', seconds: 300 },
	{ id: 'set_10min', label: '10 MIN', seconds: 600 },
	{ id: 'set_15min', label: '15 MIN', seconds: 900 },
	{ id: 'set_30min', label: '30 MIN', seconds: 1800 },
	{ id: 'set_60min', label: '60 MIN', seconds: 3600 },
]

export function buildPresets(self: TimerInstance): TimerPresets {
	const L = self.label
	const presets: CompanionPresetDefinitions<TimerSchema> = {}

	presets['time_display'] = {
		type: 'simple',
		name: 'Output (time + event colours)',
		style: { text: `OUT\n$(${L}:time)`, size: LABEL_SIZE, color: WHITE, bgcolor: BLACK, alignment: CENTER },
		steps: [{ down: [], up: [] }],
		feedbacks: [{ feedbackId: 'timer_colors', options: {} }],
	}
	presets['clock_display'] = {
		type: 'simple',
		name: 'Clock (press to show the clock on the output)',
		style: { text: 'CLOCK\n$(internal:time_hms)', size: LABEL_SIZE, color: WHITE, bgcolor: BLACK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'clock', options: {} }], up: [] }],
		feedbacks: [],
	}
	presets['set_start'] = {
		type: 'simple',
		name: 'START (the set time)',
		style: { text: `START\n$(${L}:set_time)`, size: LABEL_SIZE, color: WHITE, bgcolor: RED, alignment: CENTER },
		steps: [{ down: [{ actionId: 'set', options: {} }], up: [] }],
		feedbacks: [],
	}
	presets['start_pause'] = {
		type: 'simple',
		name: 'PAUSE/START/SHOW COUNTDOWN (follows the state)',
		style: { text: `$(${L}:start_label)`, size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'start', options: {} }], up: [] }],
		feedbacks: [{ feedbackId: 'running', options: {}, style: { bgcolor: GREEN } }],
	}
	presets['pause'] = {
		type: 'simple',
		name: 'PAUSE',
		style: { text: 'PAUSE', size: LABEL_SIZE, color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'pause', options: {} }], up: [] }],
		feedbacks: [],
	}
	presets['plus_min'] = {
		type: 'simple',
		name: '+1 min',
		style: { text: '+1 MIN', size: LABEL_SIZE, color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'up', options: {} }], up: [] }],
		feedbacks: [],
	}
	presets['minus_min'] = {
		type: 'simple',
		name: '-1 min',
		style: { text: '-1 MIN', size: LABEL_SIZE, color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'down', options: {} }], up: [] }],
		feedbacks: [],
	}
	presets['next_cue'] = {
		type: 'simple',
		name: 'Next cue',
		style: { text: 'NEXT\nCUE', size: LABEL_SIZE, color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'next', options: {} }], up: [] }],
		feedbacks: [],
	}

	for (const q of QUICK_TIMES) {
		presets[q.id] = {
			type: 'simple',
			name: q.label,
			style: { text: q.label, size: LABEL_SIZE, color: ACCENT, bgcolor: DARK, alignment: CENTER },
			steps: [{ down: [{ actionId: 'settime', options: { seconds: q.seconds } }], up: [] }],
			feedbacks: [],
		}
	}

	// One button per cue defined in the app - starts that cue directly.
	const cuePresetIds: string[] = []
	for (const c of self.state.cues) {
		const id = 'cue_' + c.id
		cuePresetIds.push(id)
		presets[id] = {
			type: 'simple',
			name: c.name,
			style: { text: `CUE\n${c.name}`, size: LABEL_SIZE, color: WHITE, bgcolor: DARK, alignment: CENTER },
			steps: [{ down: [{ actionId: 'cue_go', options: { id: c.id } }], up: [] }],
			feedbacks: [],
		}
	}

	const structure: CompanionPresetSection<TimerSchema>[] = [
		{
			id: 'timer',
			name: 'Timer',
			definitions: [
				'time_display',
				'clock_display',
				'set_start',
				'start_pause',
				'pause',
				'plus_min',
				'minus_min',
				'next_cue',
			],
		},
		{
			id: 'set_time',
			name: 'Set time',
			definitions: QUICK_TIMES.map((q) => q.id),
		},
		{
			id: 'cues',
			name: 'Cues',
			definitions: cuePresetIds,
		},
	]

	return { structure, presets }
}
