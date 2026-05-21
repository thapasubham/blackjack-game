<script lang="ts">
    import Card from "./lib/Card.svelte";
    import { onMount } from "svelte";
    import { ranks, suits, type CardType } from "./lib/types";

    let cards: CardType[] = [];

    function shuffle(cards: CardType[]) {
        const arr = [...cards];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function handleShuffle() {
        cards = shuffle(cards);
    }
    let count = 0;
    for (let i = 0; i < ranks.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            cards.push({
                id: count.toString(),
                faceUp: false,
                rank: ranks[i],
                suit: suits[j],
            });
            count++;
            handleShuffle();
        }
        handleShuffle();
    }
</script>

<div class="bg-blue-200">
    <button on:click={handleShuffle}> Shuffle </button>
    {#each cards as card}
        <Card {card} />
    {/each}
</div>
