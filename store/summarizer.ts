// stores/summarizer.ts
import { create } from "zustand";

type SummarizerInstance = Awaited<ReturnType<typeof Summarizer.create>>;

interface SummarizerState {
  instance: SummarizerInstance | null;
  status: "idle" | "downloading" | "ready" | "unavailable";
  progress: number;
  init: () => Promise<void>;
  generate: (text: string) => Promise<string>;
}

export const useSummarizerStore = create<SummarizerState>((set, get) => ({
  instance: null,
  status: "idle",
  progress: 0,

  init: async () => {
    if (get().instance) return;

    if (!("Summarizer" in window)) {
      set({ status: "unavailable" });
      return;
    }

    const availability = await Summarizer.availability();
    if (availability === "unavailable") {
      set({ status: "unavailable" });
      return;
    }

    set({ status: "downloading" });

    const instance = await Summarizer.create({
      type: "headline",
      format: "plain-text",
      length: "short",
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          set({ progress: Math.round(e.loaded * 100) });
        });
      },
    });

    set({ instance, status: "ready", progress: 100 });
  },

  generate: async (text: string) => {
    const { instance } = get();
    if (!instance) throw new Error("Not initialized");
    return instance.summarize(text);
  },
}));
