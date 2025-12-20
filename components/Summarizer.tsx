"use client";

import { useSummarizerStore } from "@/store/summarizer";
import { useEffect } from "react";

export const Summarizer = () => {
  const init = useSummarizerStore((state) => state.init);
  useEffect(() => {
    init();
  }, [init]);

  return null;
};
