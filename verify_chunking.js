
async function verify() {
  const fields = [
    "name", "capital", "population", "region", "subregion", 
    "languages", "currencies", "flags", "coatOfArms", "borders", "timezones"
  ];
  // Split into chunks of 9 + cca3
  const chunks = [];
  const chunkSize = 9;
  
  for (let i = 0; i < fields.length; i += chunkSize) {
      const chunk = fields.slice(i, i + chunkSize);
      if (!chunk.includes("cca3")) chunk.push("cca3");
      chunks.push(chunk);
  }
  
  console.log("Chunks:", chunks);

  try {
    const promises = chunks.map(async (chunk) => {
        const url = `https://restcountries.com/v3.1/all?fields=${chunk.join(",")}`;
        console.log(`Fetching: ${url}`);
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    });
    
    const results = await Promise.all(promises);
    console.log(`Received ${results.length} chunks.`);
    
    // Merge
    const merged = {};
    results.forEach(chunkData => {
        chunkData.forEach(country => {
            const id = country.cca3;
            if (!merged[id]) merged[id] = {};
            Object.assign(merged[id], country);
        });
    });
    
    console.log(`Merged ${Object.keys(merged).length} countries.`);
    const first = Object.values(merged)[0];
    console.log("First country:", JSON.stringify(first, null, 2));

  } catch (e) {
      console.error(e);
  }
}

verify();
