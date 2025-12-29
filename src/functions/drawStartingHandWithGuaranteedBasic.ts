/**
 * No allocations (no `new`) and does not mutate `deck`.
 * Writes the hand into outputArray at offset = iteration * handSize.
 *
 * Approach:
 * 1) Select one Basic uniformly via a two-pass "k-th Basic" scan.
 * 2) Fill remaining slots by repeatedly sampling a random deck position and
 *    rejecting if it's the chosen Basic or already selected (duplicate).
 * 3) Shuffle the written hand segment in-place (optional; keeps distribution closer
 *    to “random order” rather than Basic always first).
 *
 * Note: Step (2) is O(handSize^2) checks and may retry more often when handSize is
 * large relative to deck size. For typical TCG sizes it is usually fine.
 */
export function drawStartingHandWithGuaranteedBasic(
  deck: Readonly<Uint8Array>,
  outputArray: Uint8Array,
  iteration: number,
  handSize: number,
  rng: () => number = Math.random
): void {
  if (handSize <= 0) return;

  const start = iteration * handSize;
  if (start < 0 || start + handSize > outputArray.length) {
    throw new RangeError("outputArray does not have enough space for this hand write.");
  }
  const n = deck.length;
  if (n < handSize) throw new Error("Deck has fewer cards than handSize.");

  // Pass 1: count Basics
  let basicCount = 0;
  for (let i = 0; i < n; i++) basicCount += (deck[i] & 1);
  if (basicCount === 0) {
    throw new Error("No Basic cards in deck; cannot guarantee a Basic in starting hand.");
  }

  // Pass 2: pick k-th Basic uniformly
  let k = (rng() * basicCount) | 0; // 0..basicCount-1
  let chosenPos = -1;
  for (let i = 0; i < n; i++) {
    if ((deck[i] & 1) === 1) {
      if (k === 0) {
        chosenPos = i;
        break;
      }
      k--;
    }
  }
  if (chosenPos < 0) throw new Error("Failed to select a Basic card (unexpected).");

  // Write guaranteed Basic first.
  outputArray[start] = deck[chosenPos];

  // Fill remaining slots by rejection sampling (no extra buffers).
  // Ensures uniqueness (without replacement) by checking against already-written cards.
  for (let outIdx = 1; outIdx < handSize; ) {
    const pos = (rng() * n) | 0;

    // Exclude the guaranteed basic position.
    if (pos === chosenPos) continue;

    const value = deck[pos];

    // Reject if already selected (compare to previously written hand entries).
    let duplicate = false;
    for (let j = 0; j < outIdx; j++) {
      if (outputArray[start + j] === value) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) continue;

    outputArray[start + outIdx] = value;
    outIdx++;
  }

  // Optional: shuffle the hand segment in-place so Basic isn't always at index 0.
  for (let i = handSize - 1; i > 0; i--) {
    const j = (rng() * (i + 1)) | 0;
    const a = start + i;
    const b = start + j;
    const tmp = outputArray[a];
    outputArray[a] = outputArray[b];
    outputArray[b] = tmp;
  }
}
