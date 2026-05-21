<script lang="ts">
    import Card from "./lib/Card.svelte";
    import { onMount } from "svelte";
    import { ranks, suits, type CardType } from "./lib/types";
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";

    let cards: CardType[] = [];

    const MAX_FACE_UP = 10;
    const flipDurationMs = 300;

    function shuffle(cards: CardType[]) {
        const arr = [...cards];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    function faceUp(cards: CardType[]) {
        const arr = [...cards];

        for (let i = 0; i < MAX_FACE_UP; i++) {
            arr[i].faceUp = true;
        }

        return arr;
    }

    function generateCard() {
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
        cards = faceUp(cards);
    }

    onMount(() => {
        generateCard();
    });

    function handleDndConsider(e: CustomEvent) {
        cards = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        cards = e.detail.items;
    }
</script>

<div class="bg-blue-100 min-h-screen p-4">
    <button
        class="bg-green-400 px-5 py-2 rounded hover:bg-green-300 cursor-pointer mb-4"
        on:click={generateCard}
    >
        Shuffle
    </button>

    <div
        class="grid grid-cols-13 gap-2"
        use:dndzone={{
            items: cards,
            flipDurationMs,
            morphDisabled: true,
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
    >
        {#each cards as card (card.id)}
            <div
                animate:flip={{ duration: flipDurationMs }}
                class="w-24 h-32 my-2 rounded-2xl border-none"
            >
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                    role="button"
                    tabindex="0"
                    on:click={() => {
                        card.faceUp = !card.faceUp;
                        cards = cards;
                    }}
                >
                    <Card {card} />
                </div>
            </div>
        {/each}
    </div>
</div>
