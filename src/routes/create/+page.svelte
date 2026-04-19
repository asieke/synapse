<script lang="ts">
	import { goto } from '$app/navigation';
	import SynapseHeader from '$lib/components/SynapseHeader.svelte';
	import CreatorTypeAnswers from '$lib/components/CreatorTypeAnswers.svelte';
	import ShareDialog from '$lib/components/ShareDialog.svelte';
	import { buildShareUrl, encodeQuiz } from '$lib/encoding';
	import { saveDraft } from '$lib/storage';
	import type { Quiz } from '$lib/types';

	let shareUrl = $state<string | null>(null);

	function handleSave(quiz: Quiz) {
		const origin = window.location.origin;
		const url = buildShareUrl(origin, quiz);
		saveDraft({ quiz, shareUrl: url, updatedAt: Date.now() });
		shareUrl = url;
	}

	function handlePreview(quiz: Quiz) {
		goto(`/play#${encodeQuiz(quiz)}`);
	}

	function closeShare() {
		shareUrl = null;
	}
</script>

<div class="mx-auto max-w-4xl px-4 pb-24">
	<SynapseHeader subtitle="Builder" />
	<div class="mt-4">
		<span class="tag bg-[var(--color-hot)] text-[var(--color-chalk)]">New quiz</span>
		<h1 class="mt-2 font-display text-4xl leading-[0.95] font-bold tracking-tight uppercase md:text-5xl">
			Build the game
		</h1>
		<p class="mt-3 max-w-xl font-display text-lg">
			Drop in your answers, set a clock, hit <em>Save + share</em>. You'll get a link you can send
			to anyone.
		</p>
	</div>
	<div class="mt-8">
		<CreatorTypeAnswers onSave={handleSave} onPreview={handlePreview} />
	</div>
</div>

{#if shareUrl}
	<ShareDialog url={shareUrl} onClose={closeShare} />
{/if}
