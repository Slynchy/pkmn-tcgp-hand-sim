# pkmn-tcgp-hand-sim

A simple Node application for simulating Pokémon TCG Pocket starting hands in the battle mode, for determining if their deck is viable.

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