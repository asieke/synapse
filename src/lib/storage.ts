import type { PlayRecord, StoredDraft } from './types';

const DRAFTS_KEY = 'synapse:drafts:v1';
const HISTORY_KEY = 'synapse:history:v1';
const HISTORY_LIMIT = 25;

function canUseStorage(): boolean {
	return typeof window !== 'undefined' && !!window.localStorage;
}

function readJson<T>(key: string, fallback: T): T {
	if (!canUseStorage()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown): void {
	if (!canUseStorage()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// quota or disabled — silently drop
	}
}

export function listDrafts(): StoredDraft[] {
	return readJson<StoredDraft[]>(DRAFTS_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDraft(draft: StoredDraft): void {
	const drafts = readJson<StoredDraft[]>(DRAFTS_KEY, []);
	const filtered = drafts.filter((d) => d.quiz.id !== draft.quiz.id);
	filtered.push(draft);
	writeJson(DRAFTS_KEY, filtered);
}

export function deleteDraft(quizId: string): void {
	const drafts = readJson<StoredDraft[]>(DRAFTS_KEY, []);
	writeJson(
		DRAFTS_KEY,
		drafts.filter((d) => d.quiz.id !== quizId)
	);
}

export function getDraft(quizId: string): StoredDraft | undefined {
	return readJson<StoredDraft[]>(DRAFTS_KEY, []).find((d) => d.quiz.id === quizId);
}

export function listHistory(): PlayRecord[] {
	return readJson<PlayRecord[]>(HISTORY_KEY, []).sort((a, b) => b.playedAt - a.playedAt);
}

export function recordPlay(record: PlayRecord): void {
	const history = readJson<PlayRecord[]>(HISTORY_KEY, []);
	history.push(record);
	const trimmed = history.sort((a, b) => b.playedAt - a.playedAt).slice(0, HISTORY_LIMIT);
	writeJson(HISTORY_KEY, trimmed);
}
