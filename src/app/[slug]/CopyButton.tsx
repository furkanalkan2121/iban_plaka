"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  label,
  copiedLabel,
  variant = "primary",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "secondary";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={handleCopy}
        className="rounded-full border border-[#5B8DEF]/30 px-4 py-2 text-sm font-medium text-[#8FB2F7] transition-colors hover:border-[#5B8DEF]/60 hover:text-[#AFC8FA]"
      >
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full rounded-2xl bg-[#5B8DEF] px-4 py-3.5 text-sm font-semibold text-[#0B1220] transition-colors hover:bg-[#6E9BF2]"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
