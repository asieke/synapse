<script lang="ts">
	interface Props {
		subtitle?: string;
	}
	let { subtitle }: Props = $props();
</script>

<header class="flex items-center justify-between gap-4 py-6">
	<a href="/" class="group inline-flex items-center gap-3">
		<span
			class="brut-sm flex h-10 w-10 items-center justify-center bg-[var(--color-ink)] font-mono text-xl font-bold text-[var(--color-acid)]"
		>
			S
		</span>
		<span class="font-display text-2xl font-bold tracking-tight uppercase"> Synapse </span>
	</a>
	<nav class="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
		{#if subtitle}
			<span class="tag">{subtitle}</span>
		{/if}
		<a href="/" class="tag hover:bg-[var(--color-acid)]">Home</a>
		<a href="/create" class="tag hover:bg-[var(--color-acid)]">New Quiz</a>
	</nav>
</header>
