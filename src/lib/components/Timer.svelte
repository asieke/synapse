<script lang="ts">
	import { formatClock, type Timer } from '$lib/timer.svelte';

	interface Props {
		timer: Timer;
		ended?: boolean;
	}
	let { timer, ended = false }: Props = $props();

	const display = $derived(formatClock(timer.remaining));
	const urgent = $derived(!ended && timer.remaining <= 10 && timer.remaining > 0);
</script>

<div class="brut flex flex-col items-start px-5 py-4">
	<span class="tag">Time</span>
	<span
		class="tabular font-mono text-6xl leading-none font-bold md:text-7xl"
		class:text-[var(--color-hot)]={urgent}
		style={urgent ? 'animation: brut-pulse 1s infinite' : undefined}
	>
		{display}
	</span>
</div>
