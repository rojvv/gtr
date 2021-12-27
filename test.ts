import { assertEquals, fail } from "https://deno.land/std/testing/asserts.ts";
import { GTR } from "./mod.ts";

const gtr = new GTR();

Deno.test({
  name: "Sources Staying Equal",
  async fn() {
    const source = "Ev çavkanî ye.";
    const result = await gtr.translate(source);
    assertEquals(source, result.orig);
    assertEquals("ku", result.lang);
  },
});

Deno.test({
  name: "Options Working",
  async fn() {
    const sourceLang = "fr";
    const result = await gtr.translate("jeans", {
      sourceLang,
      targetLang: "ru",
    });

    assertEquals(sourceLang, result.lang);
    assertEquals(result.trans, "джинсы");
  },
});

Deno.test({
  name: "TTS Working",
  async fn() {
    const result = await gtr.tts("Hello, world!");
    const length = (await result.arrayBuffer()).byteLength;

    if (length < 1000) {
      fail();
    }
  },
});

Deno.test({
  name: "Language Getting Detected",
  async fn() {
    const result = await gtr.detect("Min nizanîbû Deno ew qas baş e.");
    assertEquals("ku", result);
  },
});
