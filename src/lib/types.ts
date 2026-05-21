export type suit = "Heart" | "Spade" | "Diamond" | "Club";

export type rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export const suits: suit[] = ["Heart", "Spade", "Diamond", "Club"];

export const ranks: rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export const suitColor: Record<suit, "red" | "black"> = {
  Heart: "red",
  Spade: "black",
  Diamond: "red",
  Club: "black",
};

export type CardType = {
  id: string;
  rank: rank;
  suit: suit;
  faceUp: boolean;
};
