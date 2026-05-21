<script lang="ts">
    import type { CardType } from "./types";
    import { IsRed, suitSymbol } from "./utils";

    export let card: CardType;

    const isRed = IsRed(card);
</script>

<div
    class="w-24 h-36 rounded-xl bg-white border-2 border-black shadow-md
           flex flex-col justify-between p-2 select-none duration-200
           hover:-translate-y-2 hover:scale-105"
>
    {#if card.faceUp}
        <div class="flex justify-between text-sm font-bold">
            <span class={isRed ? "text-red-500" : "text-black"}>
                {card.rank}
            </span>
            <span class={isRed ? "text-red-500" : "text-black"}>
                {suitSymbol[card.suit]}
            </span>
        </div>

        <div class="flex items-center justify-center text-3xl">
            <span class={isRed ? "text-red-500" : "text-black"}>
                {suitSymbol[card.suit]}
            </span>
        </div>

        <div class="flex justify-between text-sm font-bold rotate-180">
            <span class={isRed ? "text-red-500" : "text-black"}>
                {card.rank}
            </span>
            <span class={isRed ? "text-red-500" : "text-black"}>
                {suitSymbol[card.suit]}
            </span>
        </div>
    {/if}
</div>
