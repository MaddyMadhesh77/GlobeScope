const { getAllCountries } = require('./lib/api');

async function testFetch() {
  try {
    console.log("Fetching countries...");
    const countries = await getAllCountries();
    console.log(`Successfully fetched ${countries.length} countries.`);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

testFetch();
