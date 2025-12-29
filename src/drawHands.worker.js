import { parentPort, workerData } from "node:worker_threads";
import { drawStartingHandWithGuaranteedBasic } from "./functions/drawStartingHandWithGuaranteedBasic.js";

const {
  deckBuf,
  outputSAB,
  startIter,
  endIter,
  handSize,
  progressEvery,
} = workerData;

const deck = new Uint8Array(deckBuf);
const out = new Uint8Array(outputSAB);

if (!parentPort) throw new Error("No parent port found");

let sinceLast = 0;

try {
  for (let iter = startIter; iter < endIter; iter++) {
    drawStartingHandWithGuaranteedBasic(deck, out, iter, handSize);

    sinceLast++;
    if (sinceLast >= progressEvery) {
      parentPort.postMessage({ type: "progress", delta: sinceLast });
      sinceLast = 0;
    }
  }

  if (sinceLast > 0) parentPort.postMessage({ type: "progress", delta: sinceLast });

  parentPort.postMessage({ type: "done" });
} catch (e) {
  parentPort.postMessage({
    type: "error",
    error: e instanceof Error ? e.message : String(e),
  });
}
