<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import SynapseHeader from '$lib/components/SynapseHeader.svelte';
	import QuizBoard from '$lib/components/QuizBoard.svelte';
	import QuizInput from '$lib/components/QuizInput.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';
	import { decodeQuiz } from '$lib/encoding';
	import { createQuizRun, type QuizRun } from '$lib/quiz-run.svelte';
	import { recordPlay } from '$lib/storage';
	import type { Quiz } from '$lib/types';

	let quiz = $state<Quiz | null>(null);
	let run = $state<QuizRun | null>(null);
	let error = $state<string | null>(null);
	let recorded = false;

	onMount(() => {
		try {
			const hash = window.location.hash.replace(/^#/, '');
			if (!hash) {
				error = "This link doesn't have a quiz in it. Try making one instead?";
				return;
			}
			const decoded = decodeQuiz(hash);
			quiz = decoded;
			run = createQuizRun(decoded);
		} catch (e) {
			console.error(e);
			error = "This link looks broken — couldn't read the quiz from it.";
		}
	});

	$effect(() => {
		if (!run || !quiz) return;
		if (run.phase !== 'done') return;
		untrack(() => {
			if (recorded) return;
			recorded = true;
			recordPlay({
				quizId: quiz!.id,
				title: quiz!.title,
				playedAt: Date.now(),
				correct: run!.correctCount,
				total: run!.totalCount,
				finishedEarly: run!.finishedEarly,
				shareUrl: window.location.href
			});
		});
	});

	function handleSubmit(raw: string) {
		if (!run) return { matched: false };
		return run.submit(raw);
	}

	function giveUp() {
		run?.giveUp();
	}

	function restart() {
		if (!quiz) return;
		recorded = false;
		run = createQuizRun(quiz);
	}

	const isFilled = (i: number) => run?.isFilled(i) ?? false;
</script>

<div class="mx-auto max-w-6xl px-4 pb-24">
	<SynapseHeader subtitle="Now playing" />

	{#if error}
		<div class="brut mt-6 bg-[var(--color-hot)] p-8 text-[var(--color-chalk)]">
			<span class="tag bg-[var(--color-ink)] text-[var(--color-acid)]">Uh oh</span>
			<h1 class="mt-3 font-display text-3xl font-bold tracking-tight uppercase">
				We couldn't load this quiz
			</h1>
			<p class="mt-2 font-mono text-sm">{error}</p>
			<a href="/" class="brut-btn brut-btn-ink mt-5">← Back to home</a>
		</div>
	{:else if quiz && run}
		<div class="mt-4">
			<span class="tag">
				{run.phase === 'ready'
					? 'Type to begin'
					: run.phase === 'running'
						? 'In progress'
						: 'Finished'}
			</span>
			<h1 class="mt-2 font-display text-4xl leading-[0.95] font-bold tracking-tight uppercase md:text-5xl">
				{quiz.title}
			</h1>
			{#if quiz.description}
				<p class="mt-2 max-w-2xl font-display text-lg">{quiz.description}</p>
			{/if}
		</div>

		<div class="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
			<Timer timer={run.timer} ended={run.phase === 'done'} />
			<Scoreboard correct={run.correctCount} total={run.totalCount} />
			<div class="brut flex flex-col items-start px-5 py-4">
				<span class="tag">Spelling</span>
				<div class="mt-1 font-display text-3xl font-bold uppercase">
					{quiz.matchMode === 'forgiving' ? 'Typos OK' : 'Must be exact'}
				</div>
				<div class="font-mono text-xs text-[var(--color-ink)]/70">
					{quiz.columns.length > 1
						? `${quiz.columns.length} columns`
						: 'One big list'}
				</div>
			</div>
		</div>

		<div class="mt-6">
			{#if run.phase !== 'done'}
				<QuizInput onSubmit={handleSubmit} />
				<div class="mt-2 flex items-center justify-between font-mono text-xs text-[var(--color-ink)]/70">
					<span>Start typing — the clock begins with your first letter.</span>
					<button
						class="underline underline-offset-2 hover:text-[var(--color-hot)]"
						onclick={giveUp}
					>
						Show the answers
					</button>
				</div>
			{:else}
				<div class="brut bg-[var(--color-ink)] p-6 text-[var(--color-paper)]">
					<span class="tag bg-[var(--color-acid)] text-[var(--color-ink)]">
						{run.finishedEarly ? 'You got them all!' : "Time's up"}
					</span>
					<div class="mt-3 flex flex-wrap items-baseline gap-4">
						<span class="tabular font-mono text-7xl font-bold text-[var(--color-acid)]">
							{run.percent}%
						</span>
						<span class="font-display text-2xl font-bold tracking-tight uppercase">
							{run.correctCount} / {run.totalCount} correct
						</span>
					</div>
					<div class="mt-4 flex flex-wrap gap-3">
						<button class="brut-btn" onclick={restart}>Play again</button>
						<a class="brut-btn brut-btn-paper" href="/">Home</a>
						<button
							class="brut-btn brut-btn-hot"
							onclick={async () => {
								try {
									await navigator.clipboard.writeText(window.location.href);
								} catch {
									/* noop */
								}
							}}
						>
							Share this quiz
						</button>
					</div>
				</div>
			{/if}
		</div>

		<div class="mt-6">
			<QuizBoard {quiz} {isFilled} revealed={run.phase === 'done'} />
		</div>
	{:else}
		<div class="brut-sm mt-6 bg-[var(--color-chalk)] p-6 font-mono text-sm">Loading…</div>
	{/if}
</div>
