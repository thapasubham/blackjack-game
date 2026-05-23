<script lang="ts">
    import { flip } from "svelte/animate";
    import Card from "./Card.svelte";
    import type { CardType } from "./types";
    import EmptyCard from "./EmptyCard.svelte";

    export let cards: CardType[];
    export let currentHand: string = "Player Hand";
</script>

<div class="flex flex-col items-center gap-2 w-full">
    <span
        class="text-xs font-bold uppercase tracking-wider text-emerald-900/60"
    >
        {currentHand}
    </span>

    <div class="flex justify-center items-center gap-4 max-h-38 mix-h-25 py-1">
        {#if cards.length === 0}
            <EmptyCard />
        {:else}
            {#each cards as card (card.id)}
                <div
                    class="w-24 h-36 rounded-xl flex items-center justify-center"
                >
                    <Card {card} />
                </div>
            {/each}
        {/if}
    </div>
</div>
