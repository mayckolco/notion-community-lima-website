"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs border border-border/50 px-3 py-1.5 text-muted-foreground hover:border-orange-500/50 hover:text-orange-400 transition-colors"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
