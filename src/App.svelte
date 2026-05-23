<script lang="ts">
    import Card from "./lib/Card.svelte";
    import { onMount } from "svelte";
    import { ranks, suits, type CardType } from "./lib/types";
    import HandDisplay from "./lib/HandDisplay.svelte";
    import { delay } from "./lib/utils";

    let gameRunning = false;
    let status = "lost";
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
        decks = cards.slice(totalToDeal);

        for (let i = 0; i < cardsToDeal.length; i++) {
            if (i % 2 === 0) {
                tempPlayerHand.push(cardsToDeal[i]);
                Playerhands = tempPlayerHand;
                calcScore();
            } else {
                tempDealerHand.push(cardsToDeal[i]);
                dealerHand = tempDealerHand;
            }
            await delay(500);
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
        status = "lost";
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
    }

    function calcScore() {
        playerScore = reducerFunction(Playerhands);
        dealerScore = reducerFunction(dealerHand);

        if (playerScore === 21) {
            gameRunning = false;
            status = "Blackjack! You won!!!";
        }
        if (playerScore > 21) {
            gameRunning = false;
            status = "Busted! You lost!!!";
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
        dealerHand = dealerHand.map((card) => ({ ...card, faceUp: true }));

        calcScore();

        if (dealerScore > 21) {
            status = "Dealer busted! You won!!!";
        } else if (dealerScore > playerScore) {
            status = "You lost!!";
        } else if (playerScore > dealerScore) {
            status = "You won twin!!!";
        } else {
            status = "It's a push (Tie)!";
        }

        endGame();
    }

    function endGame() {
        gameRunning = false;
    }
</script>

<div
    class="min-h-screen p-4 flex justify-center items-center bg-slate-900 select-none"
>
    <div
        class="w-full max-w-2xl p-6 rounded-2xl bg-linear-to-b from-[#afdd0d] to-[#afddaf] shadow-[0_0px_2px_rgba(15,23,42,0.12),0_18px_36px_rgba(15,23,42,0.28)"
    >
        {#if status != ""}
            <div
                class="w-full flex justify-center mb-4 transition-all duration-300 animate-bounce"
            >
                <span
                    class={`text-lg font-bold uppercase tracking-wider border-l-4 border-b-4  px-6 py-2 rounded-xl shadow-xl transition-colors duration-300
                    ${
                        status.toLowerCase().includes("lost") ||
                        status.toLowerCase().includes("busted")
                            ? "text-rose-200 border-rose-500/30 bg-rose-400/80 shadow-rose-950/20"
                            : "text-lime-200 border-lime-400/30 bg-emerald-950/80 shadow-emerald-950/20"
                    }`}
                >
                    {status}
                </span>
            </div>
        {/if}

        <div class="grid gap-6">
            <div
                class="flex flex-col gap-2 bg-black/10 p-4 rounded-xl border border-white/5"
            >
                <div class="flex justify-between items-center px-1 mb-1">
                    <span
                        class="text-sm font-bold uppercase tracking-wider text-emerald-900/60"
                        >Dealer's House</span
                    >
                    {#if !gameRunning && dealerScore > 0}
                        <span
                            class="text-sm font-bold text-emerald-950 bg-white/20 px-2 py-0.5 rounded"
                        >
                            Score: {dealerScore}
                        </span>
                    {/if}
                </div>
                <HandDisplay currentHand="Dealer Hand" cards={dealerHand} />
            </div>

            <div class="flex justify-center items-center py-1 gap-4">
                <div
                    class="text-xs font-bold uppercase tracking-widest text-emerald-900/40"
                >
                    Draw Pile ({decks.length})
                </div>
                <div
                    class="transform hover:scale-105 transition-transform duration-200"
                >
                    {#if decks.length > 0}
                        <Card card={decks[0]} />
                    {:else}
                        <Card card={defaultCard} />
                    {/if}
                </div>
            </div>

            <div class="border-t border-emerald-800/10 my-0.5"></div>

            <div
                class="flex flex-col gap-3 bg-black/10 p-4 rounded-xl border border-white/5"
            >
                <div class="flex justify-between items-center px-1">
                    <span
                        class="text-sm font-bold uppercase tracking-wider text-emerald-900/80"
                        >Your Hand</span
                    >
                    <span
                        class="text-xl font-bold uppercase border-l-4 border-b-4 tracking-wider text-lime-950 bg-white/90 border-gray-400 px-4 py-0.5 rounded-lg shadow-inner"
                    >
                        Score: {playerScore}
                    </span>
                </div>
                <HandDisplay cards={Playerhands} />
            </div>

            <div class="flex flex-col gap-4 mt-2">
                <div class="flex justify-center gap-4">
                    <button
                        disabled={isProcessing || !gameRunning}
                        class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 p-3 px-8
                        border-b-4 border-yellow-600 active:border-b-0 active:border-l-0 border-l-4
                        hover:-translate-y-0.5 active:translate-y-1
                        disabled:opacity-40 disabled:pointer-events-none
                        rounded-xl shadow-md transition-all duration-150 cursor-pointer text-xl font-extrabold uppercase tracking-wide"
                        on:click={HandleHit}
                    >
                        Hit
                    </button>

                    <button
                        disabled={isProcessing || !gameRunning}
                        class="bg-slate-800 hover:bg-slate-700 text-white p-3 px-8
                        border-l-4 border-b-4 border-slate-950 active:border-b-0 active:border-l-0
                        hover:-translate-y-0.5 active:translate-y-1
                        disabled:opacity-40 disabled:pointer-events-none
                        rounded-xl shadow-md transition-all duration-150 cursor-pointer text-xl font-extrabold uppercase tracking-wide"
                        on:click={HandleStand}
                    >
                        Stand
                    </button>
                </div>

                <button
                    disabled={isProcessing}
                    class="bg-emerald-900 text-emerald-100 hover:bg-emerald-800 font-bold p-2.5 rounded-xl
                    border-l-4 border-b-4 border-emerald-950 active:border-b-0 active:border-l-0 active:translate-y-0.5
                    disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer mx-auto px-10 text-sm uppercase tracking-wider shadow-sm"
                    on:click={newCard}
                >
                    Shuffle & Deal
                </button>
            </div>
        </div>
    </div>
</div>
