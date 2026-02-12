async function binarySearch() {
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

  console.log("Testing all fields...");
  if (await testFields(allFields)) {
      console.log("✅ All fields passed together (Wait, didn't it fail before?)");
      return;
  }
  
  console.log("❌ All fields failed. usage binary search to find culprit.");
  await findBadSubset(allFields);
}

async function findBadSubset(fields) {
    if (fields.length <= 1) {
        if (await testFields(fields)) {
             console.log(`✅ Field '${fields[0]}' passed individually.`);
        } else {
             console.log(`❌ FOUND BAD FIELD: '${fields[0]}'`);
        }
        return;
    }

    const mid = Math.floor(fields.length / 2);
    const left = fields.slice(0, mid);
    const right = fields.slice(mid);
    
    console.log(`\nTesting left half (${left.length}): ${left.join(',')}`);
    const leftPass = await testFields(left);
    
    if (!leftPass) {
        console.log("❌ Left half failed. drilling down...");
        await findBadSubset(left);
    } else {
        console.log("✅ Left half passed.");
    }
    
    console.log(`\nTesting right half (${right.length}): ${right.join(',')}`);
    const rightPass = await testFields(right);
    
    if (!rightPass) {
        console.log("❌ Right half failed. drilling down...");
        await findBadSubset(right);
    } else {
        console.log("✅ Right half passed.");
    }
}


async function testFields(fields) {
  const query = fields.join(",");
  const url = `https://restcountries.com/v3.1/all?fields=${query}`;
  
  try {
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        }
    });
    return res.ok;
  } catch (error) {
      console.error(`Network Error: ${error.message}`);
      return false;
  }
}

binarySearch();
