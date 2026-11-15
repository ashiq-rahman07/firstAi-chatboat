
"use client";

import { useChat } from "@ai-sdk/react";
import { createElement, useRef, useEffect, useState, type FormEvent } from "react";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();

  const [input, setInput] = useState("");

  const isLoading =
    status === "submitted" || status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  return createElement(
    "div",
    { className: "flex flex-col h-screen bg-zinc-950 text-white" },
    createElement(
      "header",
      { className: "border-b border-zinc-800 px-4 py-3" },
      createElement(
        "h1",
        { className: "text-xl font-semibold text-center" },
        "AI Chatbot (Next.js + Groq)",
      ),
    ),
    createElement(
      "div",
      { className: "flex-1 overflow-y-auto p-4 space-y-4" },
      messages.length === 0
        ? createElement(
            "div",
            { className: "text-center text-zinc-500 mt-20" },
            createElement("p", { className: "text-lg" }, "আমাকে কিছু জিজ্ঞাসা করুন..."),
            createElement("p", { className: "text-sm mt-2" }, 'উদাহরণ: "বাংলায় একটা ছোট গল্প বলো"'),
          )
        : null,
      ...messages.map((message) =>
        createElement(
          "div",
          {
            key: message.id,
            className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
          },
          createElement(
            "div",
            {
              className: `max-w-[80%] rounded-2xl px-4 py-2.5 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-100"}`,
            },
            ...message.parts.map((part, index) =>
              part.type === "text"
                ? createElement("p", { key: index, className: "whitespace-pre-wrap" }, part.text)
                : null,
            ),
          ),
        ),
      ),
      isLoading
        ? createElement(
            "div",
            { className: "flex justify-start" },
            createElement(
              "div",
              { className: "bg-zinc-800 rounded-2xl px-4 py-2.5 text-zinc-400" },
              "টাইপ করছে...",
            ),
          )
        : null,
      <div ref={messagesEndRef} />,
    ),
    createElement(
      "div",
      { className: "border-t border-zinc-800 p-4" },
      createElement(
        "form",
        { onSubmit: handleSubmit, className: "flex gap-2 max-w-3xl mx-auto" },
        createElement("input", {
          className: "flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition",
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: "এখানে মেসেজ লিখুন...",
          disabled: isLoading,
        }),
        createElement(
          "button",
          {
            type: "submit",
            disabled: isLoading || !input.trim(),
            className: "bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition",
          },
          "পাঠান",
        ),
      ),
    ),
  );
}
