export type MatchMode = 'strict' | 'forgiving';

export interface AnswerSlot {
	canonical: string;
	accept: string[];
	prompt?: string;
}

export type ColumnRole = 'answer' | 'label';

export interface Column {
	header: string;
	slots: AnswerSlot[];
	role?: ColumnRole;
}

export interface Quiz {
	id: string;
	title: string;
	description?: string;
	durationSeconds: number;
	matchMode: MatchMode;
	columns: Column[];
	createdAt: number;
}

export interface PlayRecord {
	quizId: string;
	title: string;
	playedAt: number;
	correct: number;
	total: number;
	finishedEarly: boolean;
	shareUrl: string;
}

export interface StoredDraft {
	quiz: Quiz;
	shareUrl: string;
	updatedAt: number;
}

export function columnRole(col: Column): ColumnRole {
	return col.role ?? 'answer';
}

export function flattenColumns(columns: Column[]): AnswerSlot[] {
	const flat: AnswerSlot[] = [];
	for (const col of columns) for (const slot of col.slots) flat.push(slot);
	return flat;
}

export function answerableIndices(columns: Column[]): Set<number> {
	const set = new Set<number>();
	let offset = 0;
	for (const col of columns) {
		if (columnRole(col) === 'answer') {
			for (let i = 0; i < col.slots.length; i++) set.add(offset + i);
		}
		offset += col.slots.length;
	}
	return set;
}

export function columnSlotIndex(columns: Column[], columnIdx: number, rowIdx: number): number {
	let offset = 0;
	for (let c = 0; c < columnIdx; c++) offset += columns[c].slots.length;
	return offset + rowIdx;
}
