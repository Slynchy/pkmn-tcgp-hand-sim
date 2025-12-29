# pkmn-tcgp-hand-sim

A simple Node application for simulating Pokémon TCG Pocket starting hands in the battle mode, for determining if their deck is viable.

Example output:

```
How often each card ID was drawn in starting hands:
Card ID: P-A-116 (Shaymin), Drawn: 8716 times, Frequency: 87.16%
Card ID: B1a-005 (Spinarak), Drawn: 8572 times, Frequency: 85.72%
Card ID: A2b-001 (Weedle), Drawn: 8464 times, Frequency: 84.64%
Card ID: P-A-007 (Professor's Research), Drawn: 6383 times, Frequency: 63.83%
Card ID: A2b-003 (Beedrill ex), Drawn: 6361 times, Frequency: 63.61%
Card ID: A3-147 (Leaf Cape), Drawn: 6344 times, Frequency: 63.44%
Card ID: A3-144 (Rare Candy), Drawn: 6326 times, Frequency: 63.26%
Card ID: B1a-070 (Ariados), Drawn: 6322 times, Frequency: 63.22%
Card ID: A2b-002 (Kakuna), Drawn: 6271 times, Frequency: 62.71%
Card ID: A2-146 (Pokémon Communication), Drawn: 3130 times, Frequency: 31.30%
Card ID: P-A-005 (Poké Ball), Drawn: 3111 times, Frequency: 31.11%
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