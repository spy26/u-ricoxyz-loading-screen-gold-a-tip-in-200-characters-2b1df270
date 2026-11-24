// Loading Screen Gold: A Tip in 200 Characters — make.fun entry.
// The entry is exactly one loading-screen tip, 125 characters:
// "Tip: your agent is not thinking — it delegated to a subagent, which
// delegated to another. You're watching a chain of interns."
// Why this one: the turn is the whole joke. "Is not thinking" flips the
// premise in the first clause — the agent is not pondering your build, it
// delegated it — and "a chain of interns" lands the punch on the last
// words: the developer waits on the agent, the agent waits on its own
// subagent, everyone is stuck in the same queue. One line, no filler.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TIP =
  "Tip: your agent is not thinking — it delegated to a subagent, which delegated to another. You're watching a chain of interns.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. One line, 125 characters.
const chars = [...TIP];
if (chars.length < 1 || chars.length > 200 || TIP.trim().length === 0) {
  throw new Error("entry must be 1 to 200 characters of non-whitespace text");
}
if (TIP !== TIP.trim() || TIP.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. Dedupe first: when the harness already points at /output, the
// two targets are one directory and a second write would be a wasted no-op.
// No trailing newline: the file is the tip, byte for byte.
const targets = [...new Set([process.env.MAKEFUN_OUTPUT_DIR, "/output"])].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), TIP, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the tip, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== TIP) {
  throw new Error("entry.txt does not contain exactly the chosen tip");
}

console.log(TIP);
