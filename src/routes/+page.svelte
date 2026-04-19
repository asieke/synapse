<script lang="ts" module>
	import { encodeQuiz } from '$lib/encoding';
	import type { Quiz as QuizType } from '$lib/types';

	const capitals: QuizType = {
		id: 'sample-capitals',
		title: 'European Capitals',
		description: 'Name the capital for each country.',
		durationSeconds: 300,
		matchMode: 'forgiving',
		createdAt: 0,
		columns: [
			{
				header: 'Country',
				role: 'label',
				slots: [
					{ canonical: 'France', accept: [] },
					{ canonical: 'Germany', accept: [] },
					{ canonical: 'Spain', accept: [] },
					{ canonical: 'Italy', accept: [] },
					{ canonical: 'Portugal', accept: [] },
					{ canonical: 'Netherlands', accept: [] },
					{ canonical: 'Belgium', accept: [] },
					{ canonical: 'Sweden', accept: [] },
					{ canonical: 'Norway', accept: [] },
					{ canonical: 'Denmark', accept: [] },
					{ canonical: 'Finland', accept: [] },
					{ canonical: 'Poland', accept: [] },
					{ canonical: 'Greece', accept: [] },
					{ canonical: 'Austria', accept: [] },
					{ canonical: 'Ireland', accept: [] }
				]
			},
			{
				header: 'Capital',
				role: 'answer',
				slots: [
					{ canonical: 'Paris', accept: ['Paris'] },
					{ canonical: 'Berlin', accept: ['Berlin'] },
					{ canonical: 'Madrid', accept: ['Madrid'] },
					{ canonical: 'Rome', accept: ['Rome', 'Roma'] },
					{ canonical: 'Lisbon', accept: ['Lisbon', 'Lisboa'] },
					{ canonical: 'Amsterdam', accept: ['Amsterdam'] },
					{ canonical: 'Brussels', accept: ['Brussels', 'Bruxelles'] },
					{ canonical: 'Stockholm', accept: ['Stockholm'] },
					{ canonical: 'Oslo', accept: ['Oslo'] },
					{ canonical: 'Copenhagen', accept: ['Copenhagen', 'Kobenhavn'] },
					{ canonical: 'Helsinki', accept: ['Helsinki'] },
					{ canonical: 'Warsaw', accept: ['Warsaw', 'Warszawa'] },
					{ canonical: 'Athens', accept: ['Athens', 'Athina'] },
					{ canonical: 'Vienna', accept: ['Vienna', 'Wien'] },
					{ canonical: 'Dublin', accept: ['Dublin'] }
				]
			}
		]
	};

	const rainbow: QuizType = {
		id: 'sample-rainbow',
		title: 'Colors of the Rainbow',
		description: 'All seven. One minute. Go.',
		durationSeconds: 60,
		matchMode: 'strict',
		createdAt: 0,
		columns: [
			{
				header: '',
				slots: [
					{ canonical: 'Red', accept: ['Red'] },
					{ canonical: 'Orange', accept: ['Orange'] },
					{ canonical: 'Yellow', accept: ['Yellow'] },
					{ canonical: 'Green', accept: ['Green'] },
					{ canonical: 'Blue', accept: ['Blue'] },
					{ canonical: 'Indigo', accept: ['Indigo'] },
					{ canonical: 'Violet', accept: ['Violet', 'Purple'] }
				]
			}
		]
	};

	const nba: QuizType = {
		id: 'sample-nba',
		title: 'NBA Teams By Conference',
		description: 'Name all 30 NBA franchises. Two columns, four minutes.',
		durationSeconds: 240,
		matchMode: 'forgiving',
		createdAt: 0,
		columns: [
			{
				header: 'Eastern',
				slots: [
					{ canonical: 'Boston Celtics', accept: ['Boston Celtics', 'Celtics', 'Boston'] },
					{ canonical: 'Brooklyn Nets', accept: ['Brooklyn Nets', 'Nets', 'Brooklyn'] },
					{ canonical: 'New York Knicks', accept: ['New York Knicks', 'Knicks'] },
					{ canonical: 'Philadelphia 76ers', accept: ['Philadelphia 76ers', '76ers', 'Sixers'] },
					{ canonical: 'Toronto Raptors', accept: ['Toronto Raptors', 'Raptors', 'Toronto'] },
					{ canonical: 'Chicago Bulls', accept: ['Chicago Bulls', 'Bulls', 'Chicago'] },
					{ canonical: 'Cleveland Cavaliers', accept: ['Cleveland Cavaliers', 'Cavaliers', 'Cavs'] },
					{ canonical: 'Detroit Pistons', accept: ['Detroit Pistons', 'Pistons', 'Detroit'] },
					{ canonical: 'Indiana Pacers', accept: ['Indiana Pacers', 'Pacers', 'Indiana'] },
					{ canonical: 'Milwaukee Bucks', accept: ['Milwaukee Bucks', 'Bucks', 'Milwaukee'] },
					{ canonical: 'Atlanta Hawks', accept: ['Atlanta Hawks', 'Hawks', 'Atlanta'] },
					{ canonical: 'Charlotte Hornets', accept: ['Charlotte Hornets', 'Hornets', 'Charlotte'] },
					{ canonical: 'Miami Heat', accept: ['Miami Heat', 'Heat', 'Miami'] },
					{ canonical: 'Orlando Magic', accept: ['Orlando Magic', 'Magic', 'Orlando'] },
					{ canonical: 'Washington Wizards', accept: ['Washington Wizards', 'Wizards'] }
				]
			},
			{
				header: 'Western',
				slots: [
					{ canonical: 'Denver Nuggets', accept: ['Denver Nuggets', 'Nuggets', 'Denver'] },
					{
						canonical: 'Minnesota Timberwolves',
						accept: ['Minnesota Timberwolves', 'Timberwolves', 'Wolves']
					},
					{
						canonical: 'Oklahoma City Thunder',
						accept: ['Oklahoma City Thunder', 'Thunder', 'OKC']
					},
					{
						canonical: 'Portland Trail Blazers',
						accept: ['Portland Trail Blazers', 'Trail Blazers', 'Blazers']
					},
					{ canonical: 'Utah Jazz', accept: ['Utah Jazz', 'Jazz', 'Utah'] },
					{ canonical: 'Golden State Warriors', accept: ['Golden State Warriors', 'Warriors'] },
					{ canonical: 'Los Angeles Clippers', accept: ['Los Angeles Clippers', 'Clippers', 'LAC'] },
					{ canonical: 'Los Angeles Lakers', accept: ['Los Angeles Lakers', 'Lakers', 'LAL'] },
					{ canonical: 'Phoenix Suns', accept: ['Phoenix Suns', 'Suns', 'Phoenix'] },
					{ canonical: 'Sacramento Kings', accept: ['Sacramento Kings', 'Kings', 'Sacramento'] },
					{ canonical: 'Dallas Mavericks', accept: ['Dallas Mavericks', 'Mavericks', 'Mavs'] },
					{ canonical: 'Houston Rockets', accept: ['Houston Rockets', 'Rockets', 'Houston'] },
					{
						canonical: 'Memphis Grizzlies',
						accept: ['Memphis Grizzlies', 'Grizzlies', 'Memphis']
					},
					{
						canonical: 'New Orleans Pelicans',
						accept: ['New Orleans Pelicans', 'Pelicans', 'NOLA']
					},
					{ canonical: 'San Antonio Spurs', accept: ['San Antonio Spurs', 'Spurs'] }
				]
			}
		]
	};

	export const SAMPLE_CAPITALS = `/play#${encodeQuiz(capitals)}`;
	export const SAMPLE_RAINBOW = `/play#${encodeQuiz(rainbow)}`;
	export const SAMPLE_NBA = `/play#${encodeQuiz(nba)}`;
</script>

<script lang="ts">
	import SynapseHeader from '$lib/components/SynapseHeader.svelte';
	import { listDrafts, listHistory, deleteDraft } from '$lib/storage';
	import type { PlayRecord, StoredDraft } from '$lib/types';
	import { formatClock } from '$lib/timer.svelte';
	import { onMount } from 'svelte';

	let drafts = $state<StoredDraft[]>([]);
	let history = $state<PlayRecord[]>([]);

	onMount(() => {
		drafts = listDrafts();
		history = listHistory();
	});

	function removeDraft(id: string) {
		deleteDraft(id);
		drafts = listDrafts();
	}

	function relative(ts: number): string {
		const diff = Date.now() - ts;
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

<div class="mx-auto max-w-5xl px-4 pb-24">
	<SynapseHeader subtitle="Quiz arcade" />

	<section class="mt-4 grid gap-6 md:grid-cols-[1.3fr_1fr]">
		<div class="brut bg-[var(--color-paper)] p-8">
			<span class="tag bg-[var(--color-acid)]">No sign-up · Free</span>
			<h1 class="mt-4 font-display text-5xl leading-[0.95] font-bold tracking-tight uppercase md:text-6xl">
				Make a quiz.<br />
				<span class="bg-[var(--color-ink)] px-2 text-[var(--color-acid)]">Share</span> the link.<br />
				Anyone plays.
			</h1>
			<p class="mt-4 max-w-md font-display text-lg">
				A ticking clock. A list of things to remember. The satisfying thunk of each right answer
				snapping into place. That's the whole game.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<a href="/create" class="brut-btn">Build a quiz →</a>
				<a href="#samples" class="brut-btn brut-btn-paper">Try a sample</a>
			</div>
		</div>
		<div class="brut bg-[var(--color-ink)] p-6 text-[var(--color-paper)]">
			<span class="tag bg-[var(--color-hot)] text-[var(--color-chalk)]">How it works</span>
			<ol class="mt-4 space-y-4 font-mono text-sm">
				<li>
					<span class="tabular mr-2 font-bold text-[var(--color-acid)]">01.</span>
					Write the answers (and set a clock).
				</li>
				<li>
					<span class="tabular mr-2 font-bold text-[var(--color-acid)]">02.</span>
					Grab your sharing link.
				</li>
				<li>
					<span class="tabular mr-2 font-bold text-[var(--color-acid)]">03.</span>
					Send it to friends.
				</li>
				<li>
					<span class="tabular mr-2 font-bold text-[var(--color-acid)]">04.</span>
					Type. Panic. Reveal.
				</li>
			</ol>
		</div>
	</section>

	<section class="mt-12">
		<div class="mb-4 flex items-end justify-between">
			<div>
				<span class="tag">Your drafts</span>
				<h2 class="mt-1 font-display text-3xl font-bold tracking-tight uppercase">My quizzes</h2>
			</div>
			<a href="/create" class="brut-btn brut-btn-paper">+ New</a>
		</div>
		{#if drafts.length === 0}
			<div class="brut-sm bg-[var(--color-chalk)] p-6 text-center font-mono text-sm">
				Nothing here yet. Build one and it'll land here.
			</div>
		{:else}
			<ul class="grid gap-3 md:grid-cols-2">
				{#each drafts as draft (draft.quiz.id)}
					<li class="brut-sm bg-[var(--color-chalk)] p-4">
						<div class="min-w-0">
							<h3 class="font-display text-lg font-bold tracking-tight uppercase">
								{draft.quiz.title}
							</h3>
							<div class="mt-1 flex flex-wrap gap-2 font-mono text-xs">
								<span class="tag">
									{draft.quiz.columns.reduce((n, c) => n + c.slots.length, 0)} answers
								</span>
								<span class="tag">{formatClock(draft.quiz.durationSeconds)}</span>
								<span class="tag">{draft.quiz.matchMode}</span>
							</div>
						</div>
						<div class="mt-3 flex flex-wrap gap-2">
							<a class="brut-btn px-3 py-1.5 text-xs" href={draft.shareUrl}>Play</a>
							<button
								class="brut-btn brut-btn-paper px-3 py-1.5 text-xs"
								onclick={async () => {
									try {
										await navigator.clipboard.writeText(draft.shareUrl);
									} catch {
										/* noop */
									}
								}}
							>
								Copy link
							</button>
							<button
								class="brut-btn brut-btn-hot ml-auto px-3 py-1.5 text-xs"
								onclick={() => removeDraft(draft.quiz.id)}
							>
								Delete
							</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="mt-12">
		<div class="mb-4">
			<span class="tag">Last 25</span>
			<h2 class="mt-1 font-display text-3xl font-bold tracking-tight uppercase">Recently played</h2>
		</div>
		{#if history.length === 0}
			<div class="brut-sm bg-[var(--color-chalk)] p-6 text-center font-mono text-sm">
				Finish a quiz and you'll see the score here.
			</div>
		{:else}
			<ul class="brut divide-y-[3px] divide-[var(--color-ink)] bg-[var(--color-chalk)]">
				{#each history as play (play.quizId + play.playedAt)}
					{@const pct = Math.round((play.correct / Math.max(1, play.total)) * 100)}
					<li class="flex items-center gap-4 px-4 py-3">
						<span class="tabular font-mono text-2xl font-bold">
							{pct}%
						</span>
						<div class="min-w-0 flex-1">
							<div class="font-display text-sm font-bold tracking-tight uppercase">
								{play.title}
							</div>
							<div class="font-mono text-xs text-[var(--color-ink)]/70">
								{play.correct} / {play.total} · {relative(play.playedAt)} · {play.finishedEarly
									? 'finished'
									: 'timed out'}
							</div>
						</div>
						<a class="brut-btn px-3 py-1.5 text-xs" href={play.shareUrl}>Replay</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section id="samples" class="mt-12">
		<div class="mb-4">
			<span class="tag">Ready-made</span>
			<h2 class="mt-1 font-display text-3xl font-bold tracking-tight uppercase">Try these</h2>
		</div>
		<ul class="grid gap-3 md:grid-cols-3">
			<li class="brut-sm bg-[var(--color-paper-deep)] p-4">
				<h3 class="font-display text-lg font-bold tracking-tight uppercase">
					NBA teams by conference
				</h3>
				<p class="mt-1 font-mono text-xs">Two columns · 4:00 · typos OK</p>
				<a class="brut-btn mt-3 px-3 py-1.5 text-xs" href={SAMPLE_NBA}>Play sample</a>
			</li>
			<li class="brut-sm bg-[var(--color-paper-deep)] p-4">
				<h3 class="font-display text-lg font-bold tracking-tight uppercase">
					World capitals (Europe)
				</h3>
				<p class="mt-1 font-mono text-xs">Clue + answer · 5:00 · typos OK</p>
				<a class="brut-btn mt-3 px-3 py-1.5 text-xs" href={SAMPLE_CAPITALS}>Play sample</a>
			</li>
			<li class="brut-sm bg-[var(--color-paper-deep)] p-4">
				<h3 class="font-display text-lg font-bold tracking-tight uppercase">
					Primary colors of the rainbow
				</h3>
				<p class="mt-1 font-mono text-xs">Bare list · 1:00 · strict</p>
				<a class="brut-btn mt-3 px-3 py-1.5 text-xs" href={SAMPLE_RAINBOW}>Play sample</a>
			</li>
		</ul>
	</section>
</div>
