<script lang="ts">
	interface Props {
		onSubmit: (raw: string) => { matched: boolean };
		disabled?: boolean;
		placeholder?: string;
	}
	let { onSubmit, disabled = false, placeholder = 'Type an answer…' }: Props = $props();

	let value = $state('');
	let flash = $state<'ok' | 'miss' | null>(null);
	let inputEl: HTMLInputElement | null = $state(null);
	let flashTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (inputEl && !disabled) inputEl.focus();
	});

	function handleInput() {
		const trimmed = value.trim();
		if (!trimmed) return;
		const result = onSubmit(trimmed);
		if (result.matched) {
			value = '';
			flash = 'ok';
			if (flashTimer) clearTimeout(flashTimer);
			flashTimer = setTimeout(() => (flash = null), 300);
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const trimmed = value.trim();
			if (!trimmed) return;
			const result = onSubmit(trimmed);
			if (result.matched) {
				value = '';
				flash = 'ok';
			} else {
				flash = 'miss';
			}
			if (flashTimer) clearTimeout(flashTimer);
			flashTimer = setTimeout(() => (flash = null), 300);
		}
	}
</script>

<div class="relative">
	<div class="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xl font-bold">&gt;</div>
	<input
		bind:this={inputEl}
		bind:value
		oninput={handleInput}
		onkeydown={handleKey}
		{disabled}
		{placeholder}
		autocomplete="off"
		autocapitalize="off"
		autocorrect="off"
		spellcheck="false"
		class="brut-input pl-10 font-mono text-xl"
		class:bg-[var(--color-acid)]={flash === 'ok'}
		class:bg-[var(--color-hot)]={flash === 'miss'}
	/>
</div>
