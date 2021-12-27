# gtr

> Google Translate for Deno

```js
import { GTR } from "https://deno.land/x/gtr/mod.ts";

const gtr = new GTR();

// Translate text.
const { trans } = await gtr.translate(
  "Your text",
  { targetLang: "es" },
);

// Create speech from text and save to file.
const result = await gtr.tts("Je parle en français.");

const data = new Uint8Array(
  await result.arrayBuffer(),
);

await Deno.writeFile("result.mp3", data);
```
