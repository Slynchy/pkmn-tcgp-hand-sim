# pkmn-tcgp-hand-sim

A simple Node application for simulating Pokémon TCG Pocket starting hands in the battle mode, for determining if their deck is viable.

Example output:

```
How often each card ID was drawn in starting hands:
Card ID: p-a-116 (Shaymin), Drawn: 68338 times, Frequency: 68.34%
Card ID: b1a-005 (Spinarak), Drawn: 68271 times, Frequency: 68.27%
Card ID: a2b-001 (Weedle), Drawn: 68247 times, Frequency: 68.25%
Card ID: a3-144 (Rare Candy), Drawn: 42337 times, Frequency: 42.34%
Card ID: a2b-003 (Beedrill ex), Drawn: 42194 times, Frequency: 42.19%
Card ID: a2b-002 (Kakuna), Drawn: 42156 times, Frequency: 42.16%
Card ID: a3-147 (Leaf Cape), Drawn: 42080 times, Frequency: 42.08%
Card ID: p-a-007 (Professor's Research), Drawn: 42008 times, Frequency: 42.01%
Card ID: b1a-070 (Ariados), Drawn: 41946 times, Frequency: 41.95%
Card ID: a2-146 (Pokémon Communication), Drawn: 21290 times, Frequency: 21.29%
Card ID: p-a-005 (Poké Ball), Drawn: 21133 times, Frequency: 21.13%

How often each basic Pokemon was the guaranteed basic in starting hands:
Basic Pokemon ID: b1a-005 (Spinarak), Guaranteed Basic: 33395 times, Frequency: 33.40%
Basic Pokemon ID: p-a-116 (Shaymin), Guaranteed Basic: 33381 times, Frequency: 33.38%
Basic Pokemon ID: a2b-001 (Weedle), Guaranteed Basic: 33224 times, Frequency: 33.22%

How often each basic Pokemon was drawn in addition to the guaranteed basic:
Basic Pokemon ID: a2b-001 (Weedle), Additional Basic: 35023 times, Frequency: 35.02%
Basic Pokemon ID: p-a-116 (Shaymin), Additional Basic: 34957 times, Frequency: 34.96%
Basic Pokemon ID: b1a-005 (Spinarak), Additional Basic: 34876 times, Frequency: 34.88%

```

## Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/Slynchy/pkmn-tcgp-hand-sim.git
   cd pkmn-tcgp-hand-sim
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Prepare your deck file (refer to `data/example-deck.json`)
4. Build the project:
   ```bash
   tsc
   // or if tsc is not installed globally
   npx tsc
   ```
5. Run the simulation:
   ```bash
   node dist/main.js -v -d path/to/your/deck.json -i numberOfSimulations
   ```
   Replace `path/to/your/deck.json` with the path to your deck file and `numberOfSimulations` with the desired number of simulations to run.

## Updating Card Data

If the TCGDex finally updates their API to include the latest cards, you can update the card data by running:

```bash
node ./dist/main.js --update
```