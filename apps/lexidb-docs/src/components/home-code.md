---
---

```js
// main.js
import LexiClient from "lexidb";

async function main() {
    let client = new LexiClient("127.0.0.1:5174");
    await client.connect();
    let setResult = await client.set("vince", "is cool");
    console.log(setResult); // Ok
    let getResult = await client.get("vince");
    console.log(getResult); // is cool
}

main();

```
