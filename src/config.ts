import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type TimerConfig = {
	host: string
	port: number
	token: string
	poll: number
}

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'EventApps Timer',
			value:
				'The control token is the part after "/control-" in the remote-control address shown in the ' +
				"app's QR code window. Companion on another machine also needs network access enabled in the app.",
		},
		{ type: 'textinput', id: 'host', label: 'Timer IP', width: 6, default: '127.0.0.1', regex: Regex.IP },
		{ type: 'number', id: 'port', label: 'Port', width: 6, default: 8080, min: 1, max: 65535 },
		{ type: 'textinput', id: 'token', label: 'Control token', width: 12, default: '' },
		{ type: 'number', id: 'poll', label: 'Poll interval (ms)', width: 4, default: 250, min: 100, max: 2000 },
	]
}
