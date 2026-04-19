import type { AnswerSlot, Column, Quiz } from './types';

const VERSION = '1';

function bytesToBase64Url(bytes: Uint8Array): string {
	let binary = '';
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	const base64 = btoa(binary);
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(input: string): Uint8Array {
	const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

interface LegacyQuiz {
	id: string;
	title: string;
	description?: string;
	durationSeconds: number;
	matchMode: Quiz['matchMode'];
	slots?: AnswerSlot[];
	columns?: Column[];
	createdAt: number;
}

function migrateToColumns(raw: LegacyQuiz): Quiz {
	if (Array.isArray(raw.columns) && raw.columns.length > 0) {
		return {
			id: raw.id,
			title: raw.title,
			description: raw.description,
			durationSeconds: raw.durationSeconds,
			matchMode: raw.matchMode,
			columns: raw.columns.map((c) => ({
				header: c.header ?? '',
				slots: c.slots ?? [],
				role: c.role ?? 'answer'
			})),
			createdAt: raw.createdAt
		};
	}
	return {
		id: raw.id,
		title: raw.title,
		description: raw.description,
		durationSeconds: raw.durationSeconds,
		matchMode: raw.matchMode,
		columns: [{ header: '', slots: raw.slots ?? [] }],
		createdAt: raw.createdAt
	};
}

export function encodeQuiz(quiz: Quiz): string {
	const json = JSON.stringify(quiz);
	const bytes = new TextEncoder().encode(json);
	return VERSION + bytesToBase64Url(bytes);
}

export function decodeQuiz(payload: string): Quiz {
	if (!payload) throw new Error('Empty quiz payload');
	const version = payload[0];
	if (version !== VERSION) throw new Error(`Unsupported quiz version: ${version}`);
	const bytes = base64UrlToBytes(payload.slice(1));
	const json = new TextDecoder().decode(bytes);
	const raw = JSON.parse(json) as LegacyQuiz;
	if (!raw || typeof raw.title !== 'string') throw new Error('Invalid quiz structure');
	const quiz = migrateToColumns(raw);
	if (quiz.columns.length === 0) throw new Error('Quiz has no columns');
	return quiz;
}

export function buildShareUrl(origin: string, quiz: Quiz): string {
	return `${origin}/play#${encodeQuiz(quiz)}`;
}
