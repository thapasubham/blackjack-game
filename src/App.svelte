<script lang="ts">
    import Card from "./lib/Card.svelte";
    import { onMount } from "svelte";
    import { ranks, suits, type CardType } from "./lib/types";
    import { flip } from "svelte/animate";
    import HandDisplay from "./lib/HandDisplay.svelte";
    import { delay } from "./lib/utils";
    const flipDurationMs = 300;
    let gameRunning = false;
    let gameStatus = "";
    let status = "";
    let playerScore = 0;
    let dealerScore = 0;
    let isProcessing = false;
    const defaultCard: CardType = {
        faceUp: false,
        id: "3",
        rank: 10,
        suit: "Club",
    };
    let cards: CardType[] = [];
    let Playerhands: CardType[] = [];
    let dealerHand: CardType[] = [];

    let decks: CardType[] = [];

    const MAX_FACE_UP = 3;

    async function deckHand() {
        let tempPlayerHand: CardType[] = [];
        let tempDealerHand: CardType[] = [];

        const totalToDeal = MAX_FACE_UP + 1;
        const cardsToDeal = cards.slice(0, totalToDeal);
        console.log(cardsToDeal.length);
        decks = cards.slice(totalToDeal);
        console.log(decks.length);

        for (let i = 0; i < cardsToDeal.length; i++) {
            if (i % 2 === 0) {
                tempPlayerHand.push(cardsToDeal[i]);
                Playerhands = tempPlayerHand;
            } else {
                tempDealerHand.push(cardsToDeal[i]);
                dealerHand = tempDealerHand;
            }

            await delay(800);
        }
    }

    function shuffle(cardArray: CardType[]) {
        const arr = [...cardArray];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function faceUp(cardArray: CardType[]) {
        return cardArray.map((card, i) => {
            if (i < MAX_FACE_UP) {
                return { ...card, faceUp: true };
            }
            return card;
        });
    }

    async function newCard() {
        playerScore = 0;
        dealerScore = 0;
        isProcessing = true;
        Playerhands = [];
        dealerHand = [];
        decks = [];
        await delay(800);
        let newCards = generateCard();
        cards = shuffle(newCards);
        cards = faceUp(cards);
        await deckHand();
        isProcessing = false;
        gameRunning = true;
        calcScore();
    }

    function calcScore() {
        playerScore = reducerFunction(Playerhands);
        dealerScore = reducerFunction(dealerHand);
        if (playerScore == 21) {
            gameRunning = false;
            status = "You won!!!";
        }
        if (playerScore > 21) {
            gameRunning = false;
            status = "You lost!!!";
        }
    }
    function reducerFunction(cards: CardType[]) {
        return cards.reduce((total, card) => {
            return total + card.rank;
        }, 0);
    }
    function generateCard() {
        let count = 0;
        return suits.flatMap((suit) =>
            ranks.map((rank) => ({
                id: (count++).toString(),
                rank,
                suit,
                faceUp: false,
            })),
        );
    }

    onMount(() => {
        newCard();
    });

    async function HandleHit() {
        if (Playerhands.length >= 5) {
            status = "Max number of cards drawn";

            await delay(3000);
            status = "";
            return;
        }

        if (decks.length === 0) {
            status = "The deck is empty!";
            return;
        }
        const drawnCard = { ...decks[0], faceUp: true };
        Playerhands = [...Playerhands, drawnCard];
        decks = decks.slice(1);
        calcScore();
    }
    function HandleStand() {
        const lastIndex = dealerHand.length - 1;
        let lastCard = dealerHand[lastIndex];
        lastCard.faceUp = true;
        dealerHand[lastIndex] = lastCard;
        if (dealerScore > 21) {
            status = "You won!!!";
            endGame();
        } else if (dealerScore > playerScore) {
            status = "You lost!!";
            endGame();
        } else if (dealerScore <= dealerScore) {
            status = "You won twin!!!";
            endGame();
        }
        calcScore();
    }
    function endGame() {
        gameRunning = false;
    }
</script>

<div class=" min-h-screen p-4">
    <div
        class="mt-1 grid gap-4 scale-100! w-auto p-6 rounded-2xl transition-none bg-linear-to-b from-[#afdd0d] to-[#afddaf] shadow-[0_0px_2px_rgba(15,23,42,0.12),0_18px_36px_rgba(15,23,42,0.28)]!"
    >
        <div
            class="grid justify-center gap-4 animate:flip={{
                duration: flipDurationMs,
            }} "
        >
            {#if status != ""}
                <div
                    class="w-full flex justify-center my-3 transition-all duration-300"
                >
                    <span
                        class="text font-bold uppercase tracking-wider text-red-900 border-l-4 border-b-4 rounded
border-red-900/20 px-4 py-1."
                    >
                        {status}
                    </span>
                </div>
            {/if}
            <HandDisplay cards={Playerhands} />
            <div class="border-t border-emerald-700/10 my-1"></div>
            <HandDisplay currentHand="Dealer Hand" cards={dealerHand} />

            <div class="flex justify-center gap-4 mt-4">
                <button
                    disabled={isProcessing || !gameRunning}
                    class="bg-yellow-400 hover:bg-yellow-300 text-slate-800 p-2 px-6
                    border-l-4 border-b-4 border-yellow-600/80
                    hover:-translate-y-0.5
                    disabled:opacity-50
                    disabled:translate-0
                    disabled:translate-y-0 disabled:border-l-2 disabled:border-b-2
                    active:translate-y-0 active:border-l-2 active:border-b-2 active:bg-yellow-600
                    rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm shadow-md transition-all duration-200 cursor-pointer text-xl font-bold"
                    on:click={HandleHit}
                >
                    Hit
                </button>

                <button
                    disabled={isProcessing || !gameRunning}
                    class="bg-slate-700 hover:bg-slate-600 text-white p-2 px-6
                    border-l-4 border-b-4 border-slate-950/80
                    disabled:opacity-50
                    disabled:translate-0
                    disabled:translate-y-0 disabled:border-l-2 disabled:border-b-2
                    hover:-translate-y-0.5 active:translate-y-0 active:border-l-2 active:border-b-2 active:bg-slate-800
                    rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm shadow-md transition-all duration-200 cursor-pointer text-xl font-bold"
                    on:click={HandleStand}
                >
                    Stand
                </button>
            </div>
            <button disabled={isProcessing} class="game-btn" on:click={newCard}>
                Shuffle
            </button>
            <span>Score: {playerScore}</span>
        </div>
        {#if decks.length > 0}
            <Card card={decks[0]} />
        {:else}
            <Card card={defaultCard} />
        {/if}
    </div>
</div>
