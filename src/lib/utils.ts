import type { CardType } from "./types";

export const IsRed = (card: CardType) => {
  return card.suit === "Heart" || card.suit === "Diamond";
};

export const suitSymbol: Record<string, string> = {
  Heart: "♥",
  Diamond: "♦",
  Spade: "♠",
  Club: "♣",
};
