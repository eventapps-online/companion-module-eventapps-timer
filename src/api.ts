import type { TimerState } from './state.js'

// Non-2xx reply from the app; `status` lets the caller tell 401 (bad token) apart.
export class HttpError extends Error {
	constructor(readonly status: number) {
		super('HTTP ' + status)
	}
}

// Thin HTTP client for the Timer control API, using the global fetch of Node 22.
export class TimerApi {
	private base: string

	constructor(
		host: string,
		port: number,
		private token: string,
	) {
		this.base = `http://${host}:${port}`
	}

	private async get(path: string): Promise<Response> {
		return fetch(this.base + path, {
			headers: this.token ? { 'X-Auth-Token': this.token } : {},
			signal: AbortSignal.timeout(2500),
		})
	}

	async fetchState(): Promise<TimerState> {
		const r = await this.get('/state')
		if (!r.ok) throw new HttpError(r.status)
		return (await r.json()) as TimerState
	}

	async cmd(path: string): Promise<void> {
		const r = await this.get(path)
		if (!r.ok) throw new HttpError(r.status)
	}
}
