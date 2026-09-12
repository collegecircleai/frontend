// Self-check for public/pcm16-worklet.js — run: node scripts/check-pcm16-worklet.js
//
// The worklet is the one place in the pipeline that can silently destroy
// transcription quality (wrapped clipping, aliased resampling), and it never
// throws when it gets it wrong. This runs it outside the browser by shimming
// the two AudioWorklet globals it touches.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "public", "pcm16-worklet.js"),
  "utf8",
);

const loadProcessor = (contextSampleRate) => {
  const frames = [];
  const sandbox = {
    sampleRate: contextSampleRate,
    AudioWorkletProcessor: class {
      constructor() {
        this.port = { postMessage: (buffer) => frames.push(new Int16Array(buffer)) };
      }
    },
    registerProcessor: (_name, ctor) => {
      sandbox.__ctor = ctor;
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return { processor: new sandbox.__ctor(), frames };
};

const feed = (processor, samples, blockSize = 128) => {
  for (let i = 0; i < samples.length; i += blockSize) {
    processor.process([[samples.subarray(i, i + blockSize)]]);
  }
};

const sine = (freq, rate, seconds, amplitude = 1) => {
  const out = new Float32Array(Math.round(rate * seconds));
  for (let i = 0; i < out.length; i += 1) {
    out[i] = amplitude * Math.sin((2 * Math.PI * freq * i) / rate);
  }
  return out;
};

const flatten = (frames) => {
  const total = frames.reduce((sum, frame) => sum + frame.length, 0);
  const out = new Int16Array(total);
  let offset = 0;
  for (const frame of frames) {
    out.set(frame, offset);
    offset += frame.length;
  }
  return out;
};

const countZeroCrossings = (samples) => {
  let crossings = 0;
  for (let i = 1; i < samples.length; i += 1) {
    if (samples[i - 1] < 0 !== samples[i] < 0) {
      crossings += 1;
    }
  }
  return crossings;
};

const rms = (samples) =>
  Math.sqrt(
    Array.from(samples).reduce((sum, value) => sum + value * value, 0) /
      samples.length,
  );

// 1. 48kHz -> 16kHz: whole 200ms frames out, pitch preserved.
{
  const { processor, frames } = loadProcessor(48000);
  feed(processor, sine(1000, 48000, 1));
  const pcm = flatten(frames);

  assert.strictEqual(pcm.length, frames.length * 3200);
  assert.ok(frames.length >= 4, `expected >= 4 frames, got ${frames.length}`);

  // A 1kHz tone crosses zero 2000 times per second at any sample rate, so the
  // emitted span should carry that many pro rata. A broken resample ratio shows
  // up here as a pitch shift.
  const expected = 2000 * (pcm.length / 16000);
  const crossings = countZeroCrossings(pcm);
  assert.ok(
    Math.abs(crossings - expected) <= 4,
    `1kHz should give ~${expected} zero crossings, got ${crossings}`,
  );
}

// 1b. Anti-aliasing. Content above the 8kHz target Nyquist must be attenuated,
//     not folded back into the speech band. Point-sampling every third sample
//     passes 12kHz at full amplitude and lands it on top of the speech; the
//     window average must cut it by at least half. Speech frequencies have to
//     survive nearly intact in the same pass.
{
  const measure = (freq) => {
    const { processor, frames } = loadProcessor(48000);
    feed(processor, sine(freq, 48000, 1));
    return rms(flatten(frames));
  };

  const speech = measure(1000);
  assert.ok(
    measure(12000) < speech * 0.5,
    "content above 8kHz must be attenuated before decimation (aliasing)",
  );
  assert.ok(
    measure(3000) > speech * 0.9,
    "3kHz speech content must pass through nearly unattenuated",
  );
}

// 2. 16kHz context: pass-through, no resampling, still full scale.
{
  const { processor, frames } = loadProcessor(16000);
  feed(processor, sine(440, 16000, 0.4));
  const pcm = flatten(frames);
  assert.strictEqual(pcm.length, 6400, "16kHz context must pass straight through");
  const peak = Math.max(...Array.from(pcm).map(Math.abs));
  assert.ok(peak > 32000, `full-scale sine should reach int16 peak, got ${peak}`);
}

// 3. Overdriven input clamps instead of wrapping. Unclamped scaling turns a
//    +1.5 sample into a large NEGATIVE int16 — an audible click, and noise to a
//    recogniser.
{
  const { processor, frames } = loadProcessor(16000);
  const hot = new Float32Array(3200).fill(1.5);
  hot.set(new Float32Array(1600).fill(-1.5), 1600);
  feed(processor, hot);
  const pcm = flatten(frames);
  assert.strictEqual(pcm.length, 3200);
  for (let i = 0; i < 1600; i += 1) {
    assert.strictEqual(pcm[i], 32767, `positive overdrive must clamp at index ${i}`);
  }
  for (let i = 1600; i < 3200; i += 1) {
    assert.strictEqual(pcm[i], -32768, `negative overdrive must clamp at index ${i}`);
  }
}

// 4. Resampling is continuous across process() blocks — a per-block reset shows
//    up as extra zero crossings at the seams.
{
  const { processor: small, frames: smallFrames } = loadProcessor(44100);
  const { processor: large, frames: largeFrames } = loadProcessor(44100);
  const tone = sine(500, 44100, 1);
  feed(small, tone, 128);
  feed(large, tone, 4096);
  assert.strictEqual(
    countZeroCrossings(flatten(smallFrames)),
    countZeroCrossings(flatten(largeFrames)),
    "block size must not change the resampled signal",
  );
}

console.log("pcm16-worklet: 5 checks passed");
