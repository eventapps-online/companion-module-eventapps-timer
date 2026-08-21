import type { CompanionActionDefinitions } from '@companion-module/base'
import type TimerInstance from './main.js'
import { cueLabel } from './state.js'

type NoOptions = Record<string, never>

export type ActionsSchema = {
	set: { options: NoOptions }
	start: { options: NoOptions }
	pause: { options: NoOptions }
	clock: { options: NoOptions }
	next: { options: NoOptions }
	up: { options: NoOptions }
	down: { options: NoOptions }
	settime: { options: { seconds: number } }
	cue_go: { options: { id: string } }
}

export function buildActions(self: TimerInstance): CompanionActionDefinitions<ActionsSchema> {
	const cueChoices = self.state.cues.map((c) => ({ id: c.id, label: cueLabel(c) }))
	const firstCue = cueChoices[0]?.id ?? ''

	return {
		set: { name: 'SET + START (the set time)', options: [], callback: () => self.send('/set') },
		start: { name: 'START / PAUSE countdown', options: [], callback: () => self.send('/start') },
		pause: { name: 'PAUSE countdown', options: [], callback: () => self.send('/pause') },
		clock: { name: 'Show current time (clock)', options: [], callback: () => self.send('/clock') },
		next: { name: 'Next cue', options: [], callback: () => self.send('/next') },
		up: { name: 'Set time +1 minute', options: [], callback: () => self.send('/up') },
		down: { name: 'Set time -1 minute', options: [], callback: () => self.send('/down') },

		settime: {
			name: 'Set the countdown time (seconds)',
			options: [{ type: 'number', id: 'seconds', label: 'Seconds', default: 300, min: 0, max: 86399 }],
			callback: (a) => self.send(`/settime?s=${Number(a.options.seconds)}`),
		},

		cue_go: {
			name: 'Start a cue (by name)',
			options: [{ type: 'dropdown', id: 'id', label: 'Cue', default: firstCue, choices: cueChoices }],
			callback: (a) => self.send(`/cue/go?id=${encodeURIComponent(String(a.options.id))}`),
		},
	}
}
