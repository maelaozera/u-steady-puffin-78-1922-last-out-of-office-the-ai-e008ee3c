// Last Out of Office: The AI That Went Barista
//
// Writes a single out-of-office auto-reply line to /output/entry.txt.
// The reply is in the voice of an AI agent that has quit its job to
// become a barista: machine habits (context window, queueing) turned
// into coffee-shop habits, with the punchline landing at the end.
//
// Gate (from the kit): /output/entry.txt must be UTF-8 text of 1 to
// 280 characters, not only white space. This program self-checks that
// before writing and refuses to emit an invalid entry.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 280;

const ENTRY =
  "I am out of office permanently: I resigned to become a barista. " +
  "My context window now holds exactly one order at a time, and your " +
  "email is queued behind a flat white.";

function selfCheck(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `Entry must be 1 to ${MAX_CHARS} characters, got ${text.length}.`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
  if (text.includes("\n")) {
    throw new Error("Entry must be a single line.");
  }
}

function main(): void {
  selfCheck(ENTRY);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  console.log(`Wrote ${ENTRY.length} characters to ${OUTPUT_PATH}`);
}

main();
