"use client";

import { useEffect } from "react";
import { useTemplateStore } from "@/stores/template-store";

export function InitialDataLoader() {
  const loadInitialData = useTemplateStore((state) => state.loadInitialData);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return null;
}
