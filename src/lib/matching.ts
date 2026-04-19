import type { AnswerSlot, MatchMode } from './types';

export function normalize(raw: string): string {
	return raw
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/^(the|a|an)\s+/, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');
}

function fuzzyThreshold(len: number): number {
	if (len <= 3) return 0;
	if (len <= 6) return 1;
	if (len <= 10) return 2;
	return 3;
}

function damerauLevenshtein(a: string, b: string, max: number): number {
	if (a === b) return 0;
	if (Math.abs(a.length - b.length) > max) return max + 1;
	const rows: number[][] = [];
	for (let i = 0; i <= a.length; i++) rows.push(new Array(b.length + 1).fill(0));
	for (let i = 0; i <= a.length; i++) rows[i][0] = i;
	for (let j = 0; j <= b.length; j++) rows[0][j] = j;
	for (let i = 1; i <= a.length; i++) {
		let rowMin = Infinity;
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			let d = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
			if (
				i > 1 &&
				j > 1 &&
				a[i - 1] === b[j - 2] &&
				a[i - 2] === b[j - 1]
			) {
				d = Math.min(d, rows[i - 2][j - 2] + 1);
			}
			rows[i][j] = d;
			if (d < rowMin) rowMin = d;
		}
		if (rowMin > max) return max + 1;
	}
	return rows[a.length][b.length];
}

export interface SlotIndex {
	slotIndex: number;
	acceptNormalized: string[];
}

export function indexSlots(slots: AnswerSlot[]): SlotIndex[] {
	return slots.map((slot, slotIndex) => ({
		slotIndex,
		acceptNormalized: slot.accept.map(normalize).filter(Boolean)
	}));
}

export interface MatchResult {
	slotIndex: number;
	distance: number;
}

export function findMatch(
	rawInput: string,
	index: SlotIndex[],
	filled: Set<number>,
	mode: MatchMode
): MatchResult | null {
	const input = normalize(rawInput);
	if (!input) return null;

	for (const entry of index) {
		if (filled.has(entry.slotIndex)) continue;
		if (entry.acceptNormalized.includes(input)) {
			return { slotIndex: entry.slotIndex, distance: 0 };
		}
	}

	if (mode !== 'forgiving') return null;

	const threshold = fuzzyThreshold(input.length);
	if (threshold === 0) return null;

	let best: MatchResult | null = null;
	let tiedAtBest = false;
	for (const entry of index) {
		if (filled.has(entry.slotIndex)) continue;
		let slotBest = Infinity;
		for (const accept of entry.acceptNormalized) {
			const acceptThreshold = Math.min(threshold, fuzzyThreshold(accept.length));
			if (acceptThreshold === 0) continue;
			const d = damerauLevenshtein(input, accept, acceptThreshold);
			if (d <= acceptThreshold && d < slotBest) slotBest = d;
		}
		if (slotBest === Infinity) continue;
		if (!best || slotBest < best.distance) {
			best = { slotIndex: entry.slotIndex, distance: slotBest };
			tiedAtBest = false;
		} else if (slotBest === best.distance) {
			tiedAtBest = true;
		}
	}

	if (!best || tiedAtBest) return null;
	return best;
}
