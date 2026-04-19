<script lang="ts">
	interface Props {
		correct: number;
		total: number;
	}
	let { correct, total }: Props = $props();

	const percent = $derived(total === 0 ? 0 : Math.round((correct / total) * 100));
</script>

<div class="brut flex flex-col items-start px-5 py-4">
	<span class="tag">Score</span>
	<div class="flex items-baseline gap-3">
		<span class="tabular font-mono text-6xl leading-none font-bold md:text-7xl">
			{correct}
		</span>
		<span class="font-mono text-3xl leading-none font-bold text-[var(--color-ink)]/40">
			/ {total}
		</span>
	</div>
	<span class="mt-1 font-mono text-sm font-bold tracking-widest uppercase">
		{percent}%
	</span>
</div>
