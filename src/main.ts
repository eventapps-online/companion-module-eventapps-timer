import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { getConfigFields, type TimerConfig } from './config.js'
import { HttpError, TimerApi } from './api.js'
import { emptyState, listSignature, type TimerState } from './state.js'
import { buildActions, type ActionsSchema } from './actions.js'
import { buildFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { buildVariables, variableValues, type VariablesSchema } from './variables.js'
import { buildPresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'

export type TimerSchema = {
	config: TimerConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

export default class TimerInstance extends InstanceBase<TimerSchema> {
	config: TimerConfig = { host: '127.0.0.1', port: 8080, token: '', poll: 250 }
	api: TimerApi = new TimerApi('127.0.0.1', 8080, '')
	state: TimerState = emptyState()
	online = false

	private timer: NodeJS.Timeout | undefined
	private sig = ''

	async init(config: TimerConfig): Promise<void> {
		this.config = config
		this.api = new TimerApi(config.host, config.port, config.token)
		this.rebuildDefinitions()
		this.updateStatus(InstanceStatus.Connecting)
		this.restartPolling()
	}

	async destroy(): Promise<void> {
		if (this.timer) clearInterval(this.timer)
		this.timer = undefined
	}

	async configUpdated(config: TimerConfig): Promise<void> {
		this.config = config
		this.api = new TimerApi(config.host, config.port, config.token)
		this.online = false
		this.sig = ''
		this.rebuildDefinitions()
		this.restartPolling()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	rebuildDefinitions(): void {
		this.setActionDefinitions(buildActions(this))
		this.setFeedbackDefinitions(buildFeedbacks(this))
		this.setVariableDefinitions(buildVariables(this))
		const { structure, presets } = buildPresets(this)
		this.setPresetDefinitions(structure, presets)
	}

	private restartPolling(): void {
		if (this.timer) clearInterval(this.timer)
		const iv = Math.max(100, Number(this.config.poll) || 250)
		this.timer = setInterval(() => void this.poll(), iv)
		void this.poll()
	}

	private async poll(): Promise<void> {
		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'Set the Timer IP address')
			return
		}
		try {
			this.state = await this.api.fetchState()
			if (!this.online) {
				this.online = true
				this.updateStatus(InstanceStatus.Ok)
			}
			const sig = listSignature(this.state)
			if (sig !== this.sig) {
				this.sig = sig
				this.rebuildDefinitions() // cue list changed -> refresh dropdowns and presets
			}
			this.setVariableValues(variableValues(this))
			this.checkAllFeedbacks()
		} catch (e) {
			this.online = false
			if (e instanceof HttpError && e.status === 401) {
				this.updateStatus(InstanceStatus.BadConfig, 'Wrong or missing control token')
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, String((e as Error).message))
			}
			this.setVariableValues(variableValues(this))
		}
	}

	// fire-and-forget command, then a quick optimistic refresh
	send(path: string): void {
		this.api.cmd(path).catch(() => {})
		setTimeout(() => void this.poll(), 90)
	}
}
