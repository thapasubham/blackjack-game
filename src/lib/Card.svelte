<script lang="ts">
    import type { CardType } from "./types";

    export let card: CardType;
</script>

<div class="bg-amber-500 w-auto p-1">
    {card.rank}
    {card.suit}
</div>
