import { ICardData } from "../types";

export function analyseAndPrintResults(
  results: Uint8Array,
  deck: ReadonlyArray<string>,
  sets: Record<string, ICardData[]>,
  handSize: number,
  iterations: number,
): void {
  console.log('How often each card ID was drawn in starting hands:');
  const counts: Record<string, number> = {};
  for (let iter = 0; iter < iterations; iter++) {
    const start = iter * handSize;
    for (let i = 0; i < handSize; i++) {
      const value = results[start + i];
      const cardIdx = value >> 1;
      const cardId = deck[cardIdx];
      counts[cardId] = (counts[cardId] || 0) + 1;
    }
  }
  const order = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
  for (const cardId of order) {
    const count = counts[cardId];
    const frequency = (count / iterations * 100).toFixed(2);
    console.log(`Card ID: ${cardId} (${
      sets[
        cardId.split('-')
        .slice(0, -1)
        .join('-')
      ].find(c => c.id === cardId)?.name
    }), Drawn: ${count} times, Frequency: ${frequency}%`);
  }
}