import { Command } from "commander";
import { readFileSync } from "fs";
import { analyseAndPrintResults } from "./functions";
import { CardType, ICLIArguments } from "./types";
import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { type Card } from "../lib/pokemon-tcg-pocket-card-database/index";
import { en as cardSets } from "../lib/pokemon-tcg-pocket-card-database";

async function main(args: string[], opts: ICLIArguments) {
  let verbose = opts?.verbose ?? false;
  let dataPath = opts?.deck ?? "./data/example-deck.json";
  let iterations = opts?.iterations ?? 100000;

  // load deck file
  const deckDataBuffer = readFileSync(dataPath, "utf-8");
  if (!deckDataBuffer) {
    throw new Error(`Failed to read deck data from path: ${dataPath}`);
  }
  const deck = JSON.parse(deckDataBuffer) as Array<string>;
  // load set data relevant to deck
  const sets = cardSets;
  const setsAsArray = Object.values(cardSets);
  // convert deck to Uint8Array, with values being the deck index and last bit indicating if card is Basic
  const deckCards: Uint8Array = new Uint8Array(deck.length);
  for (let i = 0; i < deck.length; i++) {
    const cardId = deck[i].toLowerCase();
    const setData = setsAsArray.find(s => s.find((c) => c.id === cardId));
    if (!setData) {
      throw new Error(`Set data not found for card ID: ${cardId}`);
    }
    const cardData = setData.find(c => c.id === cardId);
    if (!cardData) {
      throw new Error(`Card data not found for card ID: ${cardId}`);
    }
    let value = i << 1; // shift left to make space for isBasic bit
    if (cardData.type === "Pokemon" && cardData.subtype === "Basic") {
      value |= 1; // set last bit if Basic
    }
    deckCards[i] = value;
  }

  const handSize = 5;

  // run simulation
  // use workers for multi-threading if available
  if (
    typeof Worker !== "undefined" &&
    typeof SharedArrayBuffer !== "undefined"
  ) {
    const workerPath = path.join(__dirname, "drawHands.worker.js");

    const { drawStartingHandWithGuaranteedBasic } = await import(
      "./functions/drawStartingHandWithGuaranteedBasic.js"
      );


// Shared output buffer (all workers write into this)
    const outputSAB = new SharedArrayBuffer(iterations * handSize);
    const outputArray = new Uint8Array(outputSAB);

    const threads = Math.min(os.availableParallelism?.() ?? os.cpus().length, iterations);
    const chunkSize = Math.ceil(iterations / threads);

    let completedWorkers = 0;
    let completedIterations = 0;
    const progressStep = Math.max(1, Math.floor(iterations / 10));

    const workers: Worker[] = [];

    const done = new Promise<void>((resolve, reject) => {
      for (let w = 0; w < threads; w++) {
        const startIter = w * chunkSize;
        const endIter = Math.min(iterations, startIter + chunkSize);
        if (startIter >= endIter) break;

        // Copy deck for this worker (small; simplest). If you want, share via SAB too.
        const deckCopy = new Uint8Array(deckCards); // copies
        // Transferable ArrayBuffer to worker (zero-copy transfer)
        const deckBuf = deckCopy.buffer;

        const worker = new Worker(workerPath, {
          workerData: {
            deckBuf,
            outputSAB,
            startIter,
            endIter,
            handSize,
            verbose: !!verbose,
            progressEvery: Math.max(1, Math.floor((endIter - startIter) / 20)),
          },
          transferList: [deckBuf],
        });

        workers.push(worker);

        worker.on("message", (msg: any) => {
          if (msg?.type === "progress") {
            completedIterations += msg.delta;
            if (verbose && completedIterations % progressStep < msg.delta) {
              console.log(
                `Completed ${Math.min(completedIterations, iterations)} / ${iterations} iterations...`
              );
            }
          } else if (msg?.type === "done") {
            completedWorkers++;
            if (completedWorkers === workers.length) resolve();
          } else if (msg?.type === "error") {
            reject(new Error(msg.error));
          }
        });

        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
      }
    });

    await done;

    for (const w of workers) w.terminate();

    if (verbose) console.log(`Completed ${iterations} iterations of starting hand draws.`);
    analyseAndPrintResults(
      outputArray,
      deck,
      // @ts-expect-error TS cannot infer correctly here
      sets as typeof cardSets,
      handSize,
      iterations,
    );
  } else {
    const { drawStartingHandWithGuaranteedBasic } = await import("./functions/drawStartingHandWithGuaranteedBasic.js");
    const outputArray = new Uint8Array(iterations * handSize);
    for (let iter = 0; iter < iterations; iter++) {
      drawStartingHandWithGuaranteedBasic(
        deckCards,
        outputArray,
        iter,
        handSize,
      );
      if (verbose && (iter + 1) % (iterations / 10) === 0) {
        console.log(`Completed ${iter + 1} / ${iterations} iterations...`);
      }
    }
    if (verbose) console.log(`Completed ${iterations} iterations of starting hand draws.`);

    // analyze results
    analyseAndPrintResults(
      outputArray,
      deck,
      // @ts-expect-error TS cannot infer correctly here
      sets,
      handSize,
      iterations,
    );
  }
}

const program = new Command();
program
  .name("pkmn-tcgp-hand-sim")
  .description("Simulates drawing starting hands in the Pokémon TCG Pocket");
program
  .option("-i, --iterations <number>", "Number of iterations to conduct", "100000")
  .option("-d, --deck <path>", "Path to JSON file containing the cards in the deck", "./data/example-deck.json")
  .option("-v, --verbose", "Enables additional logging");

program
  .showHelpAfterError()
  .showSuggestionAfterError();

program
  .parseAsync()
  .then(() => {
    return main([], program.opts())
  })
  .catch((err) => {
    if(err) {
      console.error("An error occurred:", err.message || err);
      if (err.stack) {
        console.error(err.stack);
      }
    } else {
      console.error("An unknown error occurred.");
    }
  });