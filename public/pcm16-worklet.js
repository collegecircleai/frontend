// Mic capture -> mono 16kHz PCM16 for the live classroom transcription relay.
//
// Sarvam wants linear16 / 16000Hz / mono. The AudioContext is asked for a
// native 16kHz rate in liveTranscription.ts, in which case this only converts
// Float32 -> Int16. When a browser ignores that request and runs at 44.1/48kHz,
// this resamples by linear interpolation across block boundaries — naive
// sample-dropping aliases badly and is the usual cause of "the mic sounds fine
// but the transcript is garbage".
const TARGET_RATE = 16000;

// ~200ms per message: responsive live transcript without one WS frame per 3ms.
const FRAME_SAMPLES = TARGET_RATE / 5;

const floatToInt16 = (value) => {
  // Clamp first: a sample above 1.0 (gain staging, autoGainControl transients)
  // wraps to the opposite sign if scaled blind, which is audible as a click and
  // reads to a recogniser as noise.
  const clamped = value < -1 ? -1 : value > 1 ? 1 : value;
  return clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
};

class Pcm16Processor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / TARGET_RATE;
    this.pending = new Float32Array(0);
    this.cursor = 0;
    this.frame = new Int16Array(FRAME_SAMPLES);
    this.frameLength = 0;
  }

  pushSample(value) {
    this.frame[this.frameLength++] = floatToInt16(value);
    if (this.frameLength === FRAME_SAMPLES) {
      const out = new Int16Array(this.frame);
      this.port.postMessage(out.buffer, [out.buffer]);
      this.frameLength = 0;
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) {
      return true;
    }

    const block = input[0];

    if (this.ratio === 1) {
      for (let i = 0; i < block.length; i += 1) {
        this.pushSample(block[i]);
      }
      return true;
    }

    // Carry the unconsumed tail so a resample window can span block boundaries.
    const merged = new Float32Array(this.pending.length + block.length);
    merged.set(this.pending, 0);
    merged.set(block, this.pending.length);

    // Each output sample is the mean of the input interval it covers, not the
    // input sample nearest its centre. Point-sampling is what "linear
    // interpolation" degenerates to at an integer ratio (the common 48k -> 16k
    // case, where the fraction is always 0), and it folds every fricative and
    // room-noise component above 8kHz back down into the speech band. Averaging
    // the window is a box lowpass at the decimation rate: a few lines, no
    // dependency, and it removes most of that aliasing.
    let cursor = this.cursor;
    while (cursor + this.ratio + 1 < merged.length) {
      const end = cursor + this.ratio;
      const first = Math.floor(cursor);
      const last = Math.floor(end);
      let sum;

      if (first === last) {
        // Window narrower than one input sample (upsampling from an 8kHz
        // device): fall back to linear interpolation at its midpoint.
        const middle = (cursor + end) / 2;
        const index = Math.floor(middle);
        const fraction = middle - index;
        sum =
          (merged[index] * (1 - fraction) + merged[index + 1] * fraction) *
          this.ratio;
      } else {
        sum = merged[first] * (first + 1 - cursor);
        for (let i = first + 1; i < last; i += 1) {
          sum += merged[i];
        }
        sum += merged[last] * (end - last);
      }

      this.pushSample(sum / this.ratio);
      cursor = end;
    }

    const consumed = Math.floor(cursor);
    this.pending = merged.slice(consumed);
    this.cursor = cursor - consumed;
    return true;
  }
}

registerProcessor("pcm16-processor", Pcm16Processor);
