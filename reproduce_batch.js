
async function testBatching() {
  const fieldsPart1 = ["cca3", "name", "capital"].join(",");
  const fieldsPart2 = ["cca3", "population", "region"].join(",");

  try {
    console.log("Fetching batch 1...");
    const [res1, res2] = await Promise.all([
        fetch(`https://restcountries.com/v3.1/all?fields=${fieldsPart1}`),
        fetch(`https://restcountries.com/v3.1/all?fields=${fieldsPart2}`)
    ]);

    if (!res1.ok || !res2.ok) {
        console.error("One of the requests failed:", res1.status, res2.status);
        return;
    }

    const data1 = await res1.json();
    const data2 = await res2.json();

    console.log(`Batch 1 length: ${data1.length}`);
    console.log(`Batch 2 length: ${data2.length}`);

    // Merge strategy
    const map = new Map();
    data1.forEach(item => {
        map.set(item.cca3, { ...item });
    });

    data2.forEach(item => {
        if (map.has(item.cca3)) {
            map.set(item.cca3, { ...map.get(item.cca3), ...item });
        } else {
             console.warn("Mismatch cca3:", item.cca3);
        }
    });

    const merged = Array.from(map.values());
    console.log("Merged length:", merged.length);
    console.log("Sample merged item:", JSON.stringify(merged[0], null, 2));

  } catch (e) {
    console.error("Error:", e);
  }
}

testBatching();
