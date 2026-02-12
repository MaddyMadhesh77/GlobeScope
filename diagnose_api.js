
async function diagnose() {
  const fieldList = [
    "name",
    "capital",
    "population",
    "region",
    "subregion",
    "languages",
    "currencies",
    "flags",
    "coatOfArms",
    "borders",
    "timezones",
    "area",
    "latlng",
    "maps",
    "independent",
    "unMember",
    "landlocked",
    "continents",
    "startOfWeek",
    "tld",
    "cca3",
  ];

  const fields = fieldList.join(",");
  const url = `https://restcountries.com/v3.1/all?fields=${fields}`;
  
  console.log("Fetching URL:", url);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GlobeScope/1.0)",
        "Accept": "application/json",
      },
    });

    console.log("Status:", res.status);
    console.log("StatusText:", res.statusText);
    
    if (!res.ok) {
        const text = await res.text();
        console.log("Error Body:", text);
    } else {
        console.log("Success!");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

diagnose();
