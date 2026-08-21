import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import type TimerInstance from './main.js'

const BLACK = combineRgb(0, 0, 0)
const WHITE = combineRgb(255, 255, 255)
const GREEN = combineRgb(0, 160, 70)

type NoOptions = Record<string, never>

export type FeedbacksSchema = {
	timer_colors: { type: 'advanced'; options: NoOptions }
	running: { type: 'boolean'; options: NoOptions }
	countdown_mode: { type: 'boolean'; options: NoOptions }
}

// "#RRGGBB" (or "#AARRGGBB") -> Companion colour number
export function parseColor(s: string, fallback: number): number {
	let h = String(s ?? '')
		.replace('#', '')
		.trim()
	if (h.length === 8) h = h.substring(2)
	if (!/^[0-9a-fA-F]{6}$/.test(h)) return fallback
	return combineRgb(parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16))
}

export function buildFeedbacks(self: TimerInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	return {
		timer_colors: {
			type: 'advanced',
			name: 'Output colours (background + text, follows the timer events)',
			description: 'The button takes over the colours of the output window, which change with countdown/time events.',
			options: [],
			callback: () => ({
				bgcolor: parseColor(self.state.bg, BLACK),
				color: parseColor(self.state.fg, WHITE),
			}),
		},
		running: {
			type: 'boolean',
			name: 'Countdown is running',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.running,
		},
		countdown_mode: {
			type: 'boolean',
			name: 'Output shows the countdown (not the clock)',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.mode === 'countdown',
		},
	}
}
