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

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 280;
const MIN_CHARS = 1;
const ENCODING = "utf8" as const;

// ---------------------------------------------------------------------------
// Entry text
// ---------------------------------------------------------------------------

// The reply is built from three beats so each beat can be read (and
// reasoned about) on its own: the resignation, the barista's one-order
// rule, and the queue punchline. The beats are joined with plain spaces,
// so the final line is identical to the original single string.
const BEATS = [
  "I am out of office permanently: I resigned to become a barista.",
  "My context window now holds exactly one order at a time, and your",
  "email is queued behind a flat white.",
] as const;

function formatEntry(beats: readonly string[]): string {
  return beats.join(" ");
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Each rule mirrors one clause of the kit's gate, kept as its own
// function so a failing check names exactly the rule that was broken.

function validateLength(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${text.length}.`,
    );
  }
}

function validateNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
}

function assertSingleLine(text: string): void {
  if (text.includes("\n")) {
    throw new Error("Entry must be a single line.");
  }
}

function validateEntry(text: string): void {
  validateLength(text);
  validateNotBlank(text);
  assertSingleLine(text);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function writeEntry(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, ENCODING);
}

function reportWritten(path: string, chars: number): void {
  // One line of stdout so a run's success is visible without re-reading
  // the output file; the count is the only thing worth reporting.
  console.log(`Wrote ${chars} characters to ${path}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const entry = formatEntry(BEATS);
  validateEntry(entry);
  writeEntry(OUTPUT_PATH, entry);
  reportWritten(OUTPUT_PATH, entry.length);
}

main();
