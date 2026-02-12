
const { getAllCountries } = require('./lib/api.js');

async function verifyFix() {
  try {
    console.log("Calling getAllCountries()...");
    const countries = await getAllCountries();
    console.log(`Success! Fetched ${countries.length} countries.`);
    console.log("Sample country:", countries[0].name);
  } catch (e) {
    console.error("Verification failed:", e);
  }
}

// Mock fetch if running in Node without global fetch (Node 17-), but user has 23.5.0 so it's fine.
// But we need to handle ES modules. `lib/api.js` is ESM.
// This script is CJS (require).
// I should make this script ESM `verify_fix.mjs` or use dynamic import.

import('./lib/api.js').then(mod => {
    mod.getAllCountries().then(countries => {
        console.log(`Success! Fetched ${countries.length} countries.`);
        console.log("Sample country:", countries[0].name);
    }).catch(e => console.error(e));
});
