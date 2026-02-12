
async function test() {
  const fields10 = [
    "capital", // Removed name
    "population",
    "region",
    "subregion",
    "languages",
    "currencies",
    "flags",
    "coatOfArms",
    "borders",
    "timezones", // 10th
  ];
  
  const query = fields10.join(",");
  const url = `https://restcountries.com/v3.1/all?fields=${query}`;
  console.log(`Fetching 10 fields (no name, with timezones): ${url}`);
  
  try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      console.log(`Status: ${res.status}`);
      if (!res.ok) console.log(await res.text());
  } catch (e) {
      console.log(e);
  }
}

test();
