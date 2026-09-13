"use client";
import { useEffect } from "react";

type ModelContext = { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> };

export function WebMcpTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "search_guests",
      title: "Search wedding guests",
      description: "Find active wedding guests by a partial guest or family/group name and return their table, seat, and arrival status.",
      inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1 } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute(input: unknown) {
        const query = typeof input === "object" && input !== null && "query" in input ? String((input as { query: unknown }).query).trim() : "";
        if (!query) throw new Error("A guest name is required.");
        const response = await fetch(`/api/guests?q=${encodeURIComponent(query)}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Guest search failed.");
        const data = await response.json() as { guests: unknown[] };
        return { guests: data.guests };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  return null;
}


