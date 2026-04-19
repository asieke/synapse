export function createTimer(totalSeconds: number) {
	let running = $state(false);
	let remaining = $state(totalSeconds);
	let startedAt = 0;
	let initialRemaining = totalSeconds;
	let handle: ReturnType<typeof setInterval> | null = null;

	function tick() {
		const elapsed = (performance.now() - startedAt) / 1000;
		const next = Math.max(0, initialRemaining - elapsed);
		remaining = next;
		if (next <= 0) {
			running = false;
			if (handle) {
				clearInterval(handle);
				handle = null;
			}
		}
	}

	function start() {
		if (running || remaining <= 0) return;
		running = true;
		initialRemaining = remaining;
		startedAt = performance.now();
		handle = setInterval(tick, 100);
	}

	function stop() {
		running = false;
		if (handle) {
			clearInterval(handle);
			handle = null;
		}
	}

	function reset(seconds: number = totalSeconds) {
		stop();
		remaining = seconds;
	}

	return {
		get running() {
			return running;
		},
		get remaining() {
			return remaining;
		},
		get total() {
			return totalSeconds;
		},
		start,
		stop,
		reset
	};
}

export type Timer = ReturnType<typeof createTimer>;

export function formatClock(seconds: number): string {
	const total = Math.max(0, Math.ceil(seconds));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
