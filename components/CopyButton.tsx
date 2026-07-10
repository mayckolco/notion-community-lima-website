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
      className="text-xs rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
