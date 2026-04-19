<script lang="ts">
	import { columnRole, type Column, type Quiz } from '$lib/types';

	interface Props {
		quiz: Quiz;
		isFilled: (i: number) => boolean;
		revealed: boolean;
	}
	let { quiz, isFilled, revealed }: Props = $props();

	const columns = $derived(quiz.columns);
	const hasHeaders = $derived(columns.some((c) => c.header.trim().length > 0));
	const hasLabels = $derived(columns.some((c) => columnRole(c) === 'label'));
	const anyPrompts = $derived(
		columns.some(
			(c) => columnRole(c) === 'answer' && c.slots.some((s) => s.prompt && s.prompt.trim().length > 0)
		)
	);
	const isSingleBare = $derived(
		columns.length === 1 &&
			!hasHeaders &&
			!anyPrompts &&
			!hasLabels &&
			columnRole(columns[0]) === 'answer'
	);
	const maxRows = $derived(columns.reduce((n, c) => Math.max(n, c.slots.length), 0));

	function startOffset(colIdx: number): number {
		let offset = 0;
		for (let i = 0; i < colIdx; i++) offset += columns[i].slots.length;
		return offset;
	}

	function rowBg(filled: boolean, col: Column): string {
		if (columnRole(col) === 'label') return 'bg-[var(--color-paper-deep)]';
		if (filled) return 'bg-[var(--color-slate)]';
		if (revealed) return 'bg-[var(--color-hot)]';
		return 'bg-[var(--color-ash)]';
	}

	function textColor(filled: boolean, col: Column): string {
		if (columnRole(col) === 'label') return 'text-[var(--color-ink)]';
		if (filled) return 'text-[var(--color-acid)]';
		if (revealed) return 'text-[var(--color-chalk)]';
		return 'text-[var(--color-ink)]';
	}

	const gridTemplateRows = $derived(
		hasHeaders
			? `auto repeat(${maxRows}, minmax(44px, auto))`
			: `repeat(${maxRows}, minmax(44px, auto))`
	);
	const columnRowSpan = $derived(hasHeaders ? maxRows + 2 : maxRows + 1);
</script>

{#if isSingleBare}
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
		{#each columns[0].slots as slot, i (i)}
			{@const filled = isFilled(i)}
			<div
				class="brut-sm flex min-h-[44px] items-center justify-center px-3 py-1.5 text-center font-display text-sm font-semibold {rowBg(
					filled,
					columns[0]
				)} {textColor(filled, columns[0])}"
				class:line-through={!filled && revealed}
			>
				{filled || revealed ? slot.canonical : '\u00A0'}
			</div>
		{/each}
	</div>
{:else}
	<div
		class="grid"
		style="grid-template-columns: repeat({columns.length}, minmax(0, 1fr)); grid-template-rows: {gridTemplateRows}; column-gap: 1rem; row-gap: 0;"
	>
		{#each columns as col, ci (ci)}
			{@const offset = startOffset(ci)}
			{@const role = columnRole(col)}
			{@const isLabel = role === 'label'}
			<div
				class="brut grid overflow-hidden"
				class:bg-[var(--color-ash)]={!isLabel}
				class:bg-[var(--color-paper-deep)]={isLabel}
				style="grid-row: 1 / {columnRowSpan}; grid-template-rows: subgrid; row-gap: 0;"
			>
				{#if hasHeaders}
					<div
						class="flex items-center border-b-[3px] border-[var(--color-ink)] px-3 py-2 font-display text-xs font-bold tracking-widest uppercase md:text-sm"
						class:bg-[var(--color-ink)]={!isLabel}
						class:text-[var(--color-acid)]={!isLabel}
						class:bg-[var(--color-paper)]={isLabel}
						class:text-[var(--color-ink)]={isLabel}
					>
						{col.header.trim() || '\u00A0'}
					</div>
				{/if}
				{#each col.slots as slot, ri (ri)}
					{@const globalIdx = offset + ri}
					{@const isLastOfCol = ri === col.slots.length - 1}
					{@const filled = !isLabel && isFilled(globalIdx)}
					{@const rowRevealed = !isLabel && !filled && revealed}
					{@const hasPrompt = !isLabel && !!slot.prompt && slot.prompt.trim().length > 0}
					<div
						class="flex min-h-full items-stretch {rowBg(filled, col)}"
						class:border-b-[3px]={!isLastOfCol}
						class:border-[var(--color-ink)]={!isLastOfCol}
					>
						{#if hasPrompt}
							<div
								class="flex min-w-[64px] items-center justify-end border-r-[3px] border-[var(--color-ink)] px-3 py-1.5 font-mono text-sm font-bold md:text-base {textColor(
									filled,
									col
								)}"
							>
								{slot.prompt}
							</div>
							<div
								class="flex flex-1 items-center px-3 py-1.5 font-display text-sm font-semibold md:text-base {textColor(
									filled,
									col
								)}"
								class:line-through={rowRevealed}
							>
								{filled || revealed ? slot.canonical : '\u00A0'}
							</div>
						{:else}
							<div
								class="flex flex-1 items-center px-3 py-1.5 font-display text-sm font-semibold md:text-base {textColor(
									filled,
									col
								)}"
								class:line-through={rowRevealed}
							>
								{isLabel ? slot.canonical : filled || revealed ? slot.canonical : '\u00A0'}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/if}
