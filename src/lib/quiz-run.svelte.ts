import { SvelteSet } from 'svelte/reactivity';
import { answerableIndices, flattenColumns, type Quiz } from './types';
import { findMatch, indexSlots, type SlotIndex } from './matching';
import { createTimer, type Timer } from './timer.svelte';

export type RunPhase = 'ready' | 'running' | 'done';

export interface QuizRun {
	readonly quiz: Quiz;
	readonly timer: Timer;
	readonly phase: RunPhase;
	readonly correctCount: number;
	readonly totalCount: number;
	readonly percent: number;
	readonly finishedEarly: boolean;
	isFilled(slotIndex: number): boolean;
	submit(raw: string): { matched: boolean; slotIndex?: number };
	giveUp(): void;
}

export function createQuizRun(quiz: Quiz): QuizRun {
	const timer = createTimer(quiz.durationSeconds);
	const flatSlots = flattenColumns(quiz.columns);
	const answerable = answerableIndices(quiz.columns);
	const fullIndex: SlotIndex[] = indexSlots(flatSlots);
	// Restrict matching to answer columns only — label columns are static clues.
	const matchIndex: SlotIndex[] = fullIndex.filter((e) => answerable.has(e.slotIndex));
	const filled = new SvelteSet<number>();
	let phase = $state<RunPhase>('ready');
	let finishedEarly = $state(false);

	const totalCount = answerable.size;
	const correctCount = $derived(filled.size);
	const percent = $derived(totalCount === 0 ? 0 : Math.round((filled.size / totalCount) * 100));

	$effect(() => {
		if (phase === 'running' && timer.remaining <= 0) {
			phase = 'done';
		}
	});

	$effect(() => {
		if (phase === 'running' && filled.size === totalCount && totalCount > 0) {
			finishedEarly = true;
			phase = 'done';
			timer.stop();
		}
	});

	function submit(raw: string) {
		if (phase === 'done') return { matched: false };
		if (phase === 'ready') {
			phase = 'running';
			timer.start();
		}
		const match = findMatch(raw, matchIndex, filled, quiz.matchMode);
		if (!match) return { matched: false };
		filled.add(match.slotIndex);
		return { matched: true, slotIndex: match.slotIndex };
	}

	function giveUp() {
		phase = 'done';
		timer.stop();
	}

	return {
		get quiz() {
			return quiz;
		},
		get timer() {
			return timer;
		},
		get phase() {
			return phase;
		},
		get correctCount() {
			return correctCount;
		},
		get totalCount() {
			return totalCount;
		},
		get percent() {
			return percent;
		},
		get finishedEarly() {
			return finishedEarly;
		},
		isFilled(i: number) {
			return filled.has(i);
		},
		submit,
		giveUp
	};
}
