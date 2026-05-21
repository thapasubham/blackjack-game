<script lang="ts">
    import Card from "./lib/Card.svelte";
    import { onMount } from "svelte";
    import { ranks, suits, type CardType } from "./lib/types";

    let cards: CardType[] = [];
    const MAX_FACE_UP = 10;
    function shuffle(cards: CardType[]) {
        const arr = [...cards];
        let upCount = 0;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function faceUp(cards: CardType[]) {
        const arr = [...cards];
        let upCount = 0;
        for (let i = 0; i < MAX_FACE_UP; i++) {
            arr[i].faceUp = true;
        }
        return arr;
    }
    function newCards() {
        generateCard();
        cards = shuffle(cards);
        cards = faceUp(cards);
    }
    function generateCard() {
        cards = [];
        let count = 0;

        const newCards: CardType[] = suits.flatMap((suit) =>
            ranks.map((rank) => ({
                id: (count++).toString(),
                rank,
                suit,
                faceUp: false,
            })),
        );

        cards = shuffle(newCards);
    }
    onMount(() => {
        newCards();
    });
</script>

<div class="bg-blue-100 w-auto">
    <button
        class="bg-green-400 px-5 hover:bg-green-300 hover:cursor-pointer m-2"
        on:click={newCards}
    >
        Shuffle
    </button>
    <div class="grid grid-cols-13 gap-2">
        {#each cards as card}
            <Card {card} />
        {/each}
    </div>
</div>
