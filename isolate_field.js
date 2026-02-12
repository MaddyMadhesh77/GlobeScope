
const fs = require('fs');

async function isolate() {
  const allFields = [
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

  let currentFields = [];
  const logFile = 'isolate_log.txt';
  fs.writeFileSync(logFile, ''); // Clear file

  for (const field of allFields) {
      currentFields.push(field);
      const query = currentFields.join(",");
      const url = `https://restcountries.com/v3.1/all?fields=${query}`;
      
      try {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (res.ok) {
            fs.appendFileSync(logFile, `✅ Success with ${currentFields.length} fields. Added: ${field}\n`);
        } else {
            fs.appendFileSync(logFile, `❌ Failed with ${currentFields.length} fields. Added: ${field}\n`);
            fs.appendFileSync(logFile, `❌ Status: ${res.status}\n`);
            const text = await res.text();
            fs.appendFileSync(logFile, `❌ Body: ${text}\n`);
            break;
        }
      } catch (e) {
          fs.appendFileSync(logFile, `❌ Network Error with ${field}: ${e.message}\n`);
          break;
      }
  }
}

isolate();
