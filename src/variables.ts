import type { CompanionVariableDefinitions, CompanionVariableValue } from '@companion-module/base'
import type TimerInstance from './main.js'
import { startLabel } from './state.js'

export type VariablesSchema = {
	time: CompanionVariableValue
	set_time: CompanionVariableValue
	start_label: CompanionVariableValue
	clock: CompanionVariableValue
}

export function buildVariables(_self: TimerInstance): CompanionVariableDefinitions<VariablesSchema> {
	return {
		time: { name: 'Displayed time (output)' },
		set_time: { name: 'Set time (next countdown run)' },
		start_label: { name: 'START/PAUSE label for the current state' },
		clock: { name: 'Local time of day (HH:MM:SS)' },
	}
}

// Local wall clock of the machine running Companion. Exposed as a module
// variable because preset text only supports the module's own variables -
// $(internal:time_hms) ends up as $NA when imported from a preset.
function localClock(): string {
	const d = new Date()
	const p = (n: number) => String(n).padStart(2, '0')
	return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function variableValues(self: TimerInstance): Partial<VariablesSchema> {
	const s = self.state
	return {
		time: self.online ? s.display : '',
		set_time: self.online ? s.setTimeLabel : '',
		start_label: startLabel(s),
		clock: localClock(),
	}
}
