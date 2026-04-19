<script lang="ts">
	interface Props {
		url: string;
		onClose: () => void;
	}
	let { url, onClose }: Props = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch {
			/* ignore */
		}
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/60 p-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="share-title"
>
	<div class="brut w-full max-w-xl bg-[var(--color-paper)] p-6">
		<div class="mb-3 flex items-center justify-between gap-3">
			<h2 id="share-title" class="font-display text-2xl font-bold tracking-tight uppercase">
				Your quiz is live
			</h2>
			<span class="tag bg-[var(--color-acid)]">ready to share</span>
		</div>
		<p class="mb-4 text-sm">
			Send this link to anyone. They'll play the same quiz with the same clock — no sign-ups, no
			accounts, no waiting.
		</p>
		<div class="brut-sm mb-4 max-h-40 overflow-auto bg-[var(--color-chalk)] p-3 font-mono text-xs break-all">
			{url}
		</div>
		<div class="flex flex-wrap gap-3">
			<button class="brut-btn" onclick={copy}>
				{copied ? 'Copied ✓' : 'Copy link'}
			</button>
			<a class="brut-btn brut-btn-paper" href={url} target="_blank" rel="noreferrer">
				Try it now
			</a>
			<button class="brut-btn brut-btn-ink ml-auto" onclick={onClose}> Done </button>
		</div>
	</div>
</div>
