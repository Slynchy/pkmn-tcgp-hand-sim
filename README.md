# pkmn-tcgp-hand-sim

A simple Node application for simulating Pokémon TCG Pocket starting hands in the battle mode, for determining if their deck is viable.

Example output:

```
How often each card ID was drawn in starting hands:
Card ID: P-A-116 (Shaymin), Drawn: 684768 times, Frequency: 68.48%
Card ID: A2b-001 (Weedle), Drawn: 684544 times, Frequency: 68.45%
Card ID: B1a-005 (Spinarak), Drawn: 683606 times, Frequency: 68.36%
Card ID: A3-147 (Leaf Cape), Drawn: 421393 times, Frequency: 42.14%
Card ID: B1a-070 (Ariados), Drawn: 421142 times, Frequency: 42.11%
Card ID: A2b-002 (Kakuna), Drawn: 421026 times, Frequency: 42.10%
Card ID: P-A-007 (Professor's Research), Drawn: 420987 times, Frequency: 42.10%
Card ID: A3-144 (Rare Candy), Drawn: 420700 times, Frequency: 42.07%
Card ID: A2b-003 (Beedrill ex), Drawn: 420499 times, Frequency: 42.05%
Card ID: P-A-005 (Poké Ball), Drawn: 211353 times, Frequency: 21.14%
Card ID: A2-146 (Pokémon Communication), Drawn: 209982 times, Frequency: 21.00%
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