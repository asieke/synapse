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

	function startOffset(colIdx: number): number {
		let offset = 0;
		for (let i = 0; i < colIdx; i++) offset += columns[i].slots.length;
		return offset;
	}

	function rowBg(filled: boolean, col: Column): string {
		if (columnRole(col) === 'label') return 'bg-[var(--color-paper-deep)]';
		if (filled) return 'bg-[var(--color-ink)]';
		if (revealed) return 'bg-[var(--color-hot)]';
		return 'bg-[var(--color-chalk)]';
	}

	function textColor(filled: boolean, col: Column): string {
		if (columnRole(col) === 'label') return 'text-[var(--color-ink)]';
		if (filled) return 'text-[var(--color-acid)]';
		if (revealed) return 'text-[var(--color-chalk)]';
		return 'text-[var(--color-ink)]';
	}
</script>

{#if isSingleBare}
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
		{#each columns[0].slots as slot, i (i)}
			{@const filled = isFilled(i)}
			<div
				class="brut-sm flex min-h-[56px] items-center justify-center px-3 py-2 text-center font-display text-base font-semibold {rowBg(
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
	<div class="grid gap-4" style="grid-template-columns: repeat({columns.length}, minmax(0, 1fr));">
		{#each columns as col, ci (ci)}
			{@const offset = startOffset(ci)}
			{@const role = columnRole(col)}
			{@const isLabel = role === 'label'}
			<div
				class="brut overflow-hidden"
				class:bg-[var(--color-chalk)]={!isLabel}
				class:bg-[var(--color-paper-deep)]={isLabel}
			>
				{#if col.header.trim().length > 0 || hasHeaders}
					<div
						class="border-b-[3px] border-[var(--color-ink)] px-3 py-2 font-display text-sm font-bold tracking-widest uppercase md:text-base"
						class:bg-[var(--color-ink)]={!isLabel}
						class:text-[var(--color-acid)]={!isLabel}
						class:bg-[var(--color-paper)]={isLabel}
						class:text-[var(--color-ink)]={isLabel}
					>
						{col.header.trim() || '\u00A0'}
					</div>
				{/if}
				<ul>
					{#each col.slots as slot, ri (ri)}
						{@const globalIdx = offset + ri}
						{@const filled = !isLabel && isFilled(globalIdx)}
						{@const rowRevealed = !isLabel && !filled && revealed}
						{@const hasPrompt =
							!isLabel && !!slot.prompt && slot.prompt.trim().length > 0}
						<li
							class="flex items-stretch border-b-[3px] border-[var(--color-ink)] last:border-b-0 {rowBg(
								filled,
								col
							)}"
						>
							{#if hasPrompt}
								<div
									class="flex min-w-[70px] items-center justify-end border-r-[3px] border-[var(--color-ink)] px-3 py-2 font-mono text-base font-bold md:text-lg {textColor(
										filled,
										col
									)}"
								>
									{slot.prompt}
								</div>
								<div
									class="flex-1 px-3 py-2 font-display text-base font-semibold md:text-lg {textColor(
										filled,
										col
									)}"
									class:line-through={rowRevealed}
								>
									{filled || revealed ? slot.canonical : '\u00A0'}
								</div>
							{:else}
								<div
									class="flex-1 px-3 py-2 font-display text-base font-semibold md:text-lg {textColor(
										filled,
										col
									)}"
									class:line-through={rowRevealed}
								>
									{isLabel ? slot.canonical : filled || revealed ? slot.canonical : '\u00A0'}
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
{/if}
