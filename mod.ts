export const defaultOptions = {
  url: "https://translate.googleapis.com/translate_a/single",
  ttsUrl: "https://translate.google.com/translate_tts",
  headers: {
    "user-agent":
      "GoogleTranslate/6.6.1.RC09.302039986 (Linux; U; Android 9; Redmi Note 8)",
  },
  oe: "utf-8",
  ie: "utf-8",
  translateClient: "gtx",
  ttsClient: "at",
  idx: "0",
  sl: "auto",
  tl: "en",
  dt: "t",
  dj: "1",
  prev: "input",
};

export interface GTROptions {
  // The full URL of text translation route
  url?: string;
  // The full URL of text-to-speach route
  ttsUrl?: string;
  // Request headers
  headers?: Record<string, string>;
}

export interface TranslateOptions {
  // The lanugage of the source text, pass `auto` for automatic detection.
  sourceLang?: string;
  // The language to translate into, default: `en` (English).
  targetLang?: string;
  inputEncoding?: string;
  outputEncoding?: string;
  dt?: string;
  dj?: string;
  client?: string;
}

export interface TTSOptions {
  // The length of the provided text.
  textlen?: string;
  // The lanugage to make speech for, pass `auto` or leave empty for automatic detection.
  targetLang?: string;
  inputEncoding?: string;
  outputEncoding?: string;
  idx?: string;
  prev?: string;
  client?: string;
}

export interface DetectOptions {
  inputEncoding?: string;
  dt?: string;
  dj?: string;
  client?: string;
}

export interface TranslateResult {
  orig: string;
  trans: string;
  lang: string;
}

export class GTR {
  url: string;
  ttsUrl: string;
  headers: Record<string, string>;

  constructor(opts?: GTROptions) {
    this.url = opts?.url ?? defaultOptions.url;
    this.ttsUrl = opts?.ttsUrl ?? defaultOptions.ttsUrl;
    this.headers = opts?.headers ?? defaultOptions.headers;
  }

  /**
   * Translates the provided text to `targetLang`.
   */
  async translate(
    text: string,
    opts?: TranslateOptions
  ): Promise<TranslateResult> {
    const params = new URLSearchParams({
      q: text,
      sl: opts?.sourceLang ?? defaultOptions.sl,
      tl: opts?.targetLang ?? defaultOptions.tl,
      ie: opts?.inputEncoding ?? defaultOptions.ie,
      oe: opts?.outputEncoding ?? defaultOptions.oe,
      dt: opts?.dt ?? defaultOptions.dt,
      dj: opts?.dj ?? defaultOptions.dj,
      client: opts?.client ?? defaultOptions.translateClient,
    }).toString();

    const response = await fetch(`${this.url}?${params}`, {
      headers: this.headers,
    });

    const { sentences, src: lang } = await response.json();

    const origRaw = [];
    const transRaw = [];

    for (const sentence of sentences) {
      origRaw.push(sentence.orig);
      transRaw.push(sentence.trans);
    }

    return {
      orig: origRaw.join(" "),
      trans: transRaw.join(" "),
      lang,
    };
  }

  /**
   * Creates speech for the provided text in mp3 format.
   */
  async tts(text: string, opts?: TTSOptions) {
    const params = new URLSearchParams({
      q: text,
      textlen: opts?.textlen ?? String(text.length),
      tl: opts?.targetLang ?? defaultOptions.tl,
      ie: opts?.inputEncoding ?? defaultOptions.ie,
      oe: opts?.outputEncoding ?? defaultOptions.oe,
      idx: opts?.idx ?? defaultOptions.idx,
      prev: opts?.prev ?? defaultOptions.prev,
      client: opts?.client ?? defaultOptions.ttsClient,
    });

    const response = await fetch(`${this.ttsUrl}?${params}`, {
      headers: this.headers,
    });

    return await response.blob();
  }

  /**
   * Detects the language of the provided text.
   */
  async detect(text: string, opts?: DetectOptions) {
    return (await this.translate(text, opts)).lang;
  }
}
