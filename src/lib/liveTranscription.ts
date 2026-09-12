import api from "./api";

export type LiveStatus =
  | "connecting"
  | "live"
  | "speaking"
  | "reconnecting"
  | "stopped";

export type LiveTranscriptionOptions = {
  name: string;
  subject: string;
  professor?: string;
  lecture_no?: number;
  /** Sarvam language code. "auto" handles code-mixed Hindi/English speech. */
  languageCode?: string;
  onSessionCreated?: (classId: string) => void;
  onPartial?: (text: string) => void;
  onFinal?: (line: { text: string; saved: boolean; at: Date }) => void;
  onStatus?: (status: LiveStatus) => void;
  onError?: (message: string, fatal: boolean) => void;
};

export type LiveTranscriptionSession = {
  stop: () => void;
  getClassId: () => string | null;
};

const WS_PATH = "/ws/live-classroom";

const buildSocketUrl = (token: string) => {
  const httpBase = api.defaults.baseURL!.replace(/\/api\/?$/, "");
  const wsBase = httpBase.replace(/^http/, "ws");
  return `${wsBase}${WS_PATH}?token=${encodeURIComponent(token)}`;
};

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // Chunked to stay under the argument limit of String.fromCharCode.
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + 8192)),
    );
  }
  return btoa(binary);
};

/**
 * Any authed request through `api` runs the shared response interceptor, which
 * refreshes an expired access token before we copy it into the socket URL. The
 * WebSocket handshake itself has no interceptor, so a stale token would
 * otherwise fail as an opaque 1006 close.
 */
const refreshTokenIfNeeded = async () => {
  try {
    await api.get("/classrooms", { params: { limit: 1 } });
  } catch {
    // A non-401 failure here says nothing about the token; let the socket try.
  }
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const startLiveTranscription = async (
  options: LiveTranscriptionOptions,
): Promise<LiveTranscriptionSession> => {
  // Browser-native cleanup, set before anything else touches the stream: this
  // single constraints object is the highest-leverage audio-quality change in
  // the whole pipeline.
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
    },
  });

  // Ask for 16kHz natively so the browser's own resampler does the work;
  // pcm16-worklet.js falls back to linear interpolation if this is ignored.
  const AudioContextCtor: typeof AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContextCtor({ sampleRate: 16000 });

  let socket: WebSocket | null = null;
  let classId: string | null = null;
  let stopped = false;
  let reconnectUsed = false;

  const teardownAudio = () => {
    stream.getTracks().forEach((track) => track.stop());
    audioContext.close().catch(() => {});
  };

  const stop = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event: "session.end" }));
      socket.close(1000);
    }
    socket = null;
    teardownAudio();
    options.onStatus?.("stopped");
  };

  const connect = async () => {
    const token = await refreshTokenIfNeeded();
    if (!token) {
      options.onError?.("You are signed out. Please sign in again.", true);
      stop();
      return;
    }

    options.onStatus?.(reconnectUsed ? "reconnecting" : "connecting");
    const next = new WebSocket(buildSocketUrl(token));
    socket = next;

    next.onopen = () => {
      next.send(
        JSON.stringify({
          event: "session.start",
          // Resuming keeps every chunk on the original classroom row.
          class_id: classId ?? undefined,
          name: options.name,
          subject: options.subject,
          professor: options.professor,
          lecture_no: options.lecture_no,
          language_code: options.languageCode ?? "auto",
        }),
      );
    };

    next.onmessage = (event) => {
      let message: any;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (message.event) {
        case "session.created":
          classId = message.class_id;
          if (classId) {
            options.onSessionCreated?.(classId);
          }
          options.onStatus?.("live");
          return;
        case "session.begin":
          options.onStatus?.("live");
          return;
        case "speech.start":
          options.onStatus?.("speaking");
          return;
        case "speech.end":
          options.onStatus?.("live");
          return;
        case "transcript.partial":
          options.onPartial?.(message.text ?? "");
          return;
        case "transcript.final":
          options.onPartial?.("");
          options.onFinal?.({
            text: message.text ?? "",
            saved: message.saved !== false,
            at: message.created_at ? new Date(message.created_at) : new Date(),
          });
          return;
        case "error":
          options.onError?.(
            message.message ?? "Transcription error",
            message.fatal === true,
          );
          return;
        default:
          return;
      }
    };

    next.onclose = () => {
      if (stopped || socket !== next) {
        return;
      }

      // One silent retry with a refreshed token; anything more and the user
      // deserves to be told rather than watching a dead mic icon.
      if (!reconnectUsed) {
        reconnectUsed = true;
        options.onStatus?.("reconnecting");
        connect().catch(() => {
          options.onError?.("Connection lost. Please restart the session.", true);
          stop();
        });
        return;
      }

      options.onError?.("Connection lost. Please restart the session.", true);
      stop();
    };
  };

  await audioContext.audioWorklet.addModule("/pcm16-worklet.js");
  const source = audioContext.createMediaStreamSource(stream);
  const worklet = new AudioWorkletNode(audioContext, "pcm16-processor");

  worklet.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({ event: "audio_input", audio: toBase64(event.data) }),
      );
    }
  };

  source.connect(worklet);
  // Chrome will not pull from a worklet that has no downstream node, but routing
  // mic audio to the speakers would echo, so terminate into a silent gain node.
  const silence = audioContext.createGain();
  silence.gain.value = 0;
  worklet.connect(silence).connect(audioContext.destination);

  try {
    await connect();
  } catch (error) {
    teardownAudio();
    throw error;
  }

  return { stop, getClassId: () => classId };
};
