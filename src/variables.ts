import type { CompanionVariableDefinitions, CompanionVariableValue } from '@companion-module/base'
import type TimerInstance from './main.js'
import { startLabel } from './state.js'

export type VariablesSchema = {
	time: CompanionVariableValue
	set_time: CompanionVariableValue
	start_label: CompanionVariableValue
}

export function buildVariables(_self: TimerInstance): CompanionVariableDefinitions<VariablesSchema> {
	return {
		time: { name: 'Displayed time (output)' },
		set_time: { name: 'Set time (next countdown run)' },
		start_label: { name: 'START/PAUSE label for the current state' },
	}
}

export function variableValues(self: TimerInstance): Partial<VariablesSchema> {
	const s = self.state
	return {
		time: self.online ? s.display : '',
		set_time: self.online ? s.setTimeLabel : '',
		start_label: startLabel(s),
	}
}
