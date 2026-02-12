
const fields9 = ["name","capital","population","region","subregion","languages","currencies","flags","coatOfArms"].join(",");
const fields10 = fields9 + ",borders";
const fields11 = fields10 + ",timezones";

async function testFetch() {
  console.log("Testing 9 fields...");
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields9}`, { headers: {"User-Agent": "Mozilla/5.0"} });
    console.log("9 fields status:", res.status);
  } catch (e) { console.error(e); }

  console.log("Testing 10 fields...");
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields10}`, { headers: {"User-Agent": "Mozilla/5.0"} });
    console.log("10 fields status:", res.status);
  } catch (e) { console.error(e); }

  console.log("Testing 11 fields...");
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields11}`, { headers: {"User-Agent": "Mozilla/5.0"} });
    console.log("11 fields status:", res.status);
    if (!res.ok) console.log(await res.text());
  } catch (e) { console.error(e); }
}

testFetch();
