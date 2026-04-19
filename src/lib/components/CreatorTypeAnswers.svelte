<script lang="ts">
	import { untrack } from 'svelte';
	import type { AnswerSlot, Column, ColumnRole, MatchMode, Quiz } from '$lib/types';

	interface Props {
		onSave: (quiz: Quiz) => void;
		onPreview: (quiz: Quiz) => void;
		initial?: Quiz;
	}
	let { onSave, onPreview, initial }: Props = $props();

	interface EditableColumn {
		header: string;
		text: string;
		role: ColumnRole;
	}

	const MAX_COLUMNS = 4;
	const MIN_COLUMNS = 1;

	const seed = untrack(() => {
		const src = initial;
		return {
			title: src?.title ?? '',
			description: src?.description ?? '',
			durationMinutes: Math.round((src?.durationSeconds ?? 300) / 60),
			matchMode: (src?.matchMode ?? 'forgiving') as MatchMode,
			cols: src
				? src.columns.map((c) => ({
						header: c.header,
						text: slotsToText(c.slots, c.role ?? 'answer'),
						role: (c.role ?? 'answer') as ColumnRole
					}))
				: [{ header: '', text: '', role: 'answer' as ColumnRole }]
		};
	});

	let title = $state(seed.title);
	let description = $state(seed.description);
	let durationMinutes = $state(seed.durationMinutes);
	let matchMode = $state<MatchMode>(seed.matchMode);
	let cols = $state<EditableColumn[]>(seed.cols);
	let error = $state<string | null>(null);

	function slotsToText(slots: AnswerSlot[], role: ColumnRole): string {
		if (role === 'label') {
			return slots.map((slot) => slot.canonical).join('\n');
		}
		return slots
			.map((slot) => {
				const answerPart = [
					slot.canonical,
					...slot.accept.filter((a) => a !== slot.canonical)
				].join('; ');
				return slot.prompt ? `${slot.prompt} | ${answerPart}` : answerPart;
			})
			.join('\n');
	}

	function parseLineAsAnswer(line: string): AnswerSlot | null {
		const trimmed = line.trim();
		if (!trimmed) return null;
		const pipeIdx = trimmed.indexOf('|');
		let prompt: string | undefined;
		let answerSide = trimmed;
		if (pipeIdx !== -1) {
			const p = trimmed.slice(0, pipeIdx).trim();
			const a = trimmed.slice(pipeIdx + 1).trim();
			if (p && a) {
				prompt = p;
				answerSide = a;
			}
		}
		const parts = answerSide
			.split(';')
			.map((s) => s.trim())
			.filter(Boolean);
		if (parts.length === 0) return null;
		const canonical = parts[0];
		const accept = Array.from(new Set(parts));
		return prompt ? { canonical, accept, prompt } : { canonical, accept };
	}

	function parseLineAsLabel(line: string): AnswerSlot | null {
		const trimmed = line.trim();
		if (!trimmed) return null;
		return { canonical: trimmed, accept: [] };
	}

	function addColumn() {
		if (cols.length >= MAX_COLUMNS) return;
		cols = [...cols, { header: '', text: '', role: 'answer' }];
	}

	function removeColumn(i: number) {
		if (cols.length <= MIN_COLUMNS) return;
		cols = cols.filter((_, idx) => idx !== i);
	}

	function toggleRole(i: number) {
		cols = cols.map((c, idx) =>
			idx === i ? { ...c, role: c.role === 'answer' ? 'label' : 'answer' } : c
		);
	}

	function buildQuiz(): Quiz | null {
		error = null;
		if (!title.trim()) {
			error = 'Give your quiz a title first.';
			return null;
		}
		if (durationMinutes < 1 || durationMinutes > 60) {
			error = 'The clock should be between 1 and 60 minutes.';
			return null;
		}
		const columns: Column[] = [];
		let answerSlotCount = 0;
		for (const c of cols) {
			const slots: AnswerSlot[] = [];
			const parse = c.role === 'label' ? parseLineAsLabel : parseLineAsAnswer;
			for (const line of c.text.split('\n')) {
				const slot = parse(line);
				if (slot) slots.push(slot);
			}
			if (slots.length === 0) continue;
			columns.push({ header: c.header.trim(), slots, role: c.role });
			if (c.role === 'answer') answerSlotCount += slots.length;
		}
		if (columns.length === 0) {
			error = 'Add at least one item in one column.';
			return null;
		}
		if (answerSlotCount === 0) {
			error = 'Every column is set to "Show as clues" — make at least one a guessable column.';
			return null;
		}
		const multi = columns.length > 1;
		if (multi && columns.some((c) => !c.header)) {
			error = 'With multiple columns, every column needs a header.';
			return null;
		}
		return {
			id: initial?.id ?? crypto.randomUUID(),
			title: title.trim(),
			description: description.trim() || undefined,
			durationSeconds: durationMinutes * 60,
			matchMode,
			columns,
			createdAt: initial?.createdAt ?? Date.now()
		};
	}

	function save() {
		const quiz = buildQuiz();
		if (quiz) onSave(quiz);
	}

	function preview() {
		const quiz = buildQuiz();
		if (quiz) onPreview(quiz);
	}

	const answerSinglePlaceholder = `California; Calif; CA
Texas; TX
New York; NY
Florida
…

or pair rows —
1961 | Love Me Do
1963 | Please Please Me`;

	const answerMultiPlaceholder = `Boston Celtics
Brooklyn Nets
New York Knicks
…`;

	const labelPlaceholder = `1961
1962
1963
1964
…`;
</script>

<div class="space-y-6">
	<section class="brut bg-[var(--color-chalk)] p-6">
		<div class="mb-4 flex items-center gap-3">
			<span class="tag bg-[var(--color-acid)]">Step 01</span>
			<h2 class="font-display text-xl font-bold uppercase">The basics</h2>
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			<label class="block md:col-span-2">
				<span class="mb-1 block font-mono text-xs font-bold tracking-widest uppercase">Title</span>
				<input
					type="text"
					bind:value={title}
					class="brut-input font-display text-2xl font-bold uppercase"
					placeholder="NBA teams by conference"
				/>
			</label>
			<label class="block md:col-span-2">
				<span class="mb-1 block font-mono text-xs font-bold tracking-widest uppercase">
					Short description <span class="text-[var(--color-ink)]/50">(optional)</span>
				</span>
				<input
					type="text"
					bind:value={description}
					class="brut-input"
					placeholder="Can you name all 30 in five minutes?"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block font-mono text-xs font-bold tracking-widest uppercase">
					Time limit (minutes)
				</span>
				<input
					type="number"
					min="1"
					max="60"
					bind:value={durationMinutes}
					class="brut-input tabular font-mono text-2xl font-bold"
				/>
			</label>
			<div class="block">
				<span class="mb-1 block font-mono text-xs font-bold tracking-widest uppercase">
					Spelling
				</span>
				<div class="flex gap-0">
					<button
						type="button"
						class="brut-sm flex-1 px-3 py-2 font-mono text-sm font-bold uppercase"
						class:bg-[var(--color-ink)]={matchMode === 'strict'}
						class:text-[var(--color-acid)]={matchMode === 'strict'}
						onclick={() => (matchMode = 'strict')}
					>
						Must be exact
					</button>
					<button
						type="button"
						class="brut-sm -ml-[2px] flex-1 px-3 py-2 font-mono text-sm font-bold uppercase"
						class:bg-[var(--color-ink)]={matchMode === 'forgiving'}
						class:text-[var(--color-acid)]={matchMode === 'forgiving'}
						onclick={() => (matchMode = 'forgiving')}
					>
						Typos OK
					</button>
				</div>
				<p class="mt-1 text-xs text-[var(--color-ink)]/70">
					{matchMode === 'forgiving'
						? 'Small slips still count. Short answers (2–3 letters) have to be exact.'
						: 'Players need to spell answers correctly.'}
				</p>
			</div>
		</div>
	</section>

	<section class="brut bg-[var(--color-chalk)] p-6">
		<div class="mb-3 flex flex-wrap items-center gap-3">
			<span class="tag bg-[var(--color-acid)]">Step 02</span>
			<h2 class="font-display text-xl font-bold uppercase">Columns & answers</h2>
			<span class="tag">{cols.length} {cols.length === 1 ? 'column' : 'columns'}</span>
			<div class="ml-auto flex gap-2">
				<button
					type="button"
					class="brut-btn brut-btn-paper px-3 py-1.5 text-xs"
					onclick={addColumn}
					disabled={cols.length >= MAX_COLUMNS}
				>
					+ Add column
				</button>
			</div>
		</div>
		<p class="mb-4 text-sm">
			One item per line. Use <code class="font-mono">;</code> to add other accepted spellings
			(<code class="font-mono">California; Calif; CA</code>). Check
			<em>Show as clues</em> on a column if you want it visible to the player from the start
			(like years, team names, country flags — things that give them a hint).
		</p>
		<div
			class="grid gap-4"
			style="grid-template-columns: repeat({cols.length}, minmax(0, 1fr));"
		>
			{#each cols as col, i (i)}
				<div class="brut-sm flex flex-col bg-[var(--color-paper)] p-3">
					<div class="mb-2 flex items-center gap-2">
						<span class="tag">Column {i + 1}</span>
						{#if cols.length > MIN_COLUMNS}
							<button
								type="button"
								class="ml-auto font-mono text-xs font-bold text-[var(--color-hot)] underline underline-offset-2"
								onclick={() => removeColumn(i)}
							>
								Remove
							</button>
						{/if}
					</div>
					<input
						type="text"
						bind:value={col.header}
						class="brut-input mb-2 font-display text-sm font-bold uppercase"
						placeholder={cols.length > 1 ? 'Column header (required)' : 'Column header (optional)'}
					/>
					<label
						class="mb-2 flex cursor-pointer items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase select-none"
					>
						<input
							type="checkbox"
							checked={col.role === 'label'}
							onchange={() => toggleRole(i)}
							class="h-5 w-5 cursor-pointer accent-[var(--color-ink)]"
						/>
						<span>Show as clues (don't make the player guess)</span>
					</label>
					<textarea
						bind:value={col.text}
						rows="14"
						class="brut-input block w-full flex-1 font-mono text-sm leading-relaxed"
						placeholder={col.role === 'label'
							? labelPlaceholder
							: cols.length === 1
								? answerSinglePlaceholder
								: answerMultiPlaceholder}
					></textarea>
					<p class="mt-2 font-mono text-[11px] text-[var(--color-ink)]/60">
						{#if col.role === 'label'}
							These show up next to each row as hints. Players don't type them.
						{:else}
							Players type these. Use <code>;</code> for alternate spellings.
						{/if}
					</p>
				</div>
			{/each}
		</div>
	</section>

	{#if error}
		<div
			class="brut-sm bg-[var(--color-hot)] px-4 py-3 font-mono text-sm font-bold text-[var(--color-chalk)] uppercase"
		>
			{error}
		</div>
	{/if}

	<div class="flex flex-wrap gap-3">
		<button class="brut-btn brut-btn-ink" onclick={save}>Save + share</button>
		<button class="brut-btn brut-btn-paper" onclick={preview}>Preview it</button>
	</div>
</div>
