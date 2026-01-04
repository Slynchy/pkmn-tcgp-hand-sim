import { type Card, type en } from "../../lib/pokemon-tcg-pocket-card-database/index";

export function analyseAndPrintResults(
  results: Uint8Array,
  deck: ReadonlyArray<string>,
  sets: typeof en,
  handSize: number,
  iterations: number,
): void {
  console.log('How often each card ID was drawn in starting hands:');
  const counts: Record<string, number> = {};
  const setsAsArray = Object.values(sets);
  for (let iter = 0; iter < iterations; iter++) {
    const start = iter * handSize;
    for (let i = 0; i < handSize; i++) {
      const value = results[start + i];
      const cardIdx = value >> 1;
      const cardId = deck[cardIdx].toLowerCase();
      counts[cardId] = (counts[cardId] || 0) + 1;
    }
  }
  const order = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0].toLowerCase());
  for (const cardId of order) {
    const count = counts[cardId];
    const frequency = (count / iterations * 100).toFixed(2);
    let cardName = setsAsArray.find(s => s.find((c: Card) => c.id === cardId))?.find((c: Card) => c.id === cardId)?.name;

    console.log(`Card ID: ${cardId} (${
      cardName
    }), Drawn: ${count} times, Frequency: ${frequency}%`);
  }

  console.log('\nHow often each basic Pokemon was the guaranteed basic in starting hands:');
  const basicCounts: Record<string, number> = {};
  for (let iter = 0; iter < iterations; iter++) {
    const start = iter * handSize;
    for (let i = 0; i < handSize; i++) {
      const value = results[start + i];
      const cardIdx = value >> 1;
      const isBasic = (value & 1) === 1;
      if (isBasic) {
        const cardId = deck[cardIdx].toLowerCase();
        basicCounts[cardId] = (basicCounts[cardId] || 0) + 1;
        break; // only count the first basic found
      }
    }
  }
  const basicOrder = Object.entries(basicCounts).sort((a, b) => b[1] - a[1]).map(entry => entry[0].toLowerCase());
  for (const cardId of basicOrder) {
    const count = basicCounts[cardId];
    const frequency = (count / iterations * 100).toFixed(2);
    let cardName = setsAsArray.find(s => s.find((c: Card) => c.id === cardId))?.find((c: Card) => c.id === cardId)?.name;

    console.log(`Basic Pokemon ID: ${cardId} (${
      cardName
    }), Guaranteed Basic: ${count} times, Frequency: ${frequency}%`);
  }

  console.log('\nHow often each basic Pokemon was drawn in addition to the guaranteed basic:');
  const additionalBasicCounts: Record<string, number> = {};
  for (let iter = 0; iter < iterations; iter++) {
    const start = iter * handSize;
    let guaranteedBasicFound = false;
    for (let i = 0; i < handSize; i++) {
      const value = results[start + i];
      const cardIdx = value >> 1;
      const isBasic = (value & 1) === 1;
      if (isBasic) {
        if (!guaranteedBasicFound) {
          guaranteedBasicFound = true; // skip the first basic found
        } else {
          const cardId = deck[cardIdx].toLowerCase();
          additionalBasicCounts[cardId] = (additionalBasicCounts[cardId] || 0) + 1;
        }
      }
    }
  }
  const additionalBasicOrder = Object.entries(additionalBasicCounts).sort((a, b) => b[1] - a[1]).map(entry => entry[0].toLowerCase());
  for (const cardId of additionalBasicOrder) {
    const count = additionalBasicCounts[cardId];
    const frequency = (count / iterations * 100).toFixed(2);
    let cardName = setsAsArray.find(s => s.find((c: Card) => c.id === cardId))?.find((c: Card) => c.id === cardId)?.name;

    console.log(`Basic Pokemon ID: ${cardId} (${
      cardName
    }), Additional Basic: ${count} times, Frequency: ${frequency}%`);
  }
}