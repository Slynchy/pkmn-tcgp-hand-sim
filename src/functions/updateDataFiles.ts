import TCGDex from "@tcgdex/sdk";
import { CardType, ICardData } from "../types";
import { writeFileSync } from "fs";

export async function updateDataFiles(verbose?: boolean): Promise<void> {
  const sdk = new TCGDex('en');
  const decks = [
    'A1',
    'A1a',
    'A2',
    'A2a',
    'A2b',
    'A3',
    'A3a',
    'A3b',
    'A4',
    'A4a',
    'A4b',
    'B1',
    'B1a',
    'P-A',
    // 'P-B',
  ];

  // write Set to data file
  for (const deckId of decks) {
    const deck = await sdk.set.get(deckId);
    const path = `./data/sets-${deckId}.json`;
    // console.log(`Wrote set data to ${path}`);
    const returnVal: Array<ICardData> = [];
    const promises: Promise<void>[] = deck?.cards.map(card => {
      return new Promise<void>(async (resolve, reject) => {
        const cardData = await card.getCard();
        const localId = parseInt(cardData.localId);
        const id = cardData.id;
        const stage = cardData.stage;
        const isTrainer = cardData.trainerType;
        // const isItem = cardData.item;
        let type: CardType = CardType.UNKNOWN;
        if (isTrainer) {
          if (isTrainer === 'Supporter') {
            type = CardType.Trainer;
          } else if (isTrainer === 'Item') {
            type = CardType.Item;
          } else if (verbose) {
            console.warn(`Unknown trainer type for card: ${cardData.name}`);
          }
        } else if (stage === 'Basic') {
          type = CardType.Basic;
        } else if (stage === 'Stage1') {
          type = CardType.Stage1;
        } else if (stage === 'Stage2') {
          type = CardType.Stage2;
        } else if (stage === 'MEGA') {
          type = CardType.MEGA;
        } else if(verbose) {
          console.warn(`Unknown card stage/type for card: ${cardData.name}`);
        }
        returnVal.push({
          name: cardData.name,
          idx: localId,
          id: id,
          type: type,
        });
        resolve();
      });
    }) ?? [Promise.resolve()];
    await Promise.allSettled(promises);
    returnVal.sort((a, b) => a.idx - b.idx);
    writeFileSync(path, JSON.stringify(returnVal, null, 2));
    if (verbose) console.log(`Wrote set data to ${path}`);
  }
}