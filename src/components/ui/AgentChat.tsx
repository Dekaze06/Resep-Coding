'use client';

import React, {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ChatStatus = 'ready' | 'streaming' | 'submitted' | 'idle';

export type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'error'; title?: string; message: string }
  | { type: 'widget'; content: ReactNode };

export type AgentMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
  timestamp?: string;
  agentName?: string;
  hasCodeUpdate?: boolean;
  steps?: string[];
};

export type AttachedImage = {
  id: string;
  filename: string;
  url: string;
  size?: number;
};

export type AttachedFile = {
  id: string;
  filename: string;
  size?: number;
};

export type AgentChatProps = {
  messages: AgentMessage[];
  onSend?: (message: { role: 'user'; content: string }) => void;
  onStop?: () => void;
  status?: ChatStatus;
  error?: { message: string; title?: string };
  emptyStatePosition?: 'default' | 'center';
  attachments?: {
    onAttach?: () => void;
    images?: AttachedImage[];
    files?: AttachedFile[];
    onRemoveImage?: (id: string) => void;
    onRemoveFile?: (id: string) => void;
  };
  placeholder?: string;
  className?: string;
  headerWidget?: ReactNode;
  footerWidget?: ReactNode;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
};

const SendIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const StopIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const XIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

function UserBubble({ text, timestamp }: { text: string; timestamp?: string }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-zinc-500 font-mono">
        <span>Anda</span>
        {timestamp && <span>{timestamp}</span>}
      </div>
      <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl bg-zinc-800/90 border border-zinc-700/50 text-xs sm:text-sm text-zinc-100 whitespace-pre-wrap break-words leading-relaxed shadow-sm">
        {text}
      </div>
    </div>
  );
}

function AssistantText({
  text,
  timestamp,
  agentName = "AI Agent"
}: {
  text: string;
  timestamp?: string;
  agentName?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-zinc-500 font-mono">
        <span className="font-semibold text-blue-400">{agentName}</span>
        {timestamp && <span>{timestamp}</span>}
      </div>
      <div className="w-full max-w-[95%] px-3.5 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-xs sm:text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap break-words shadow-sm">
        {text}
      </div>
    </div>
  );
}

function ErrorBubble({
  title = "Terjadi Kesalahan",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="flex justify-start w-full">
      <div className="w-full max-w-[95%] border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs sm:text-sm rounded-xl text-rose-200">
        <div className="font-semibold text-rose-300">
          {title}
        </div>
        <div className="mt-1 text-rose-400/90 text-xs leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}

function MessageList({
  messages,
  headerWidget,
  footerWidget
}: {
  messages: AgentMessage[];
  headerWidget?: ReactNode;
  footerWidget?: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, footerWidget]);

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-3.5">
      {headerWidget && <div className="mb-2">{headerWidget}</div>}

      <div className="mx-auto w-full flex flex-col gap-3.5">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-2 animate-fade-in-up">
            {m.parts.map((part, i) => {
              if (part.type === "error") {
                return (
                  <ErrorBubble
                    key={i}
                    title={part.title}
                    message={part.message}
                  />
                );
              }
              if (part.type === "widget") {
                return <div key={i} className="w-full">{part.content}</div>;
              }
              if (m.role === "user") {
                return (
                  <UserBubble
                    key={i}
                    text={part.text}
                    timestamp={m.timestamp}
                  />
                );
              }
              return (
                <AssistantText
                  key={i}
                  text={part.text}
                  timestamp={m.timestamp}
                  agentName={m.agentName}
                />
              );
            })}
          </div>
        ))}
      </div>

      {footerWidget && <div className="mt-2">{footerWidget}</div>}
    </div>
  );
}

function ImageChip({
  url,
  onRemove,
}: {
  url: string;
  onRemove?: () => void;
}) {
  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 group">
      <img src={url} alt="Attachment" className="w-full h-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <XIcon size={10} />
        </button>
      )}
    </div>
  );
}

function FileChip({
  filename,
  size,
  onRemove,
}: {
  filename: string;
  size?: number;
  onRemove?: () => void;
}) {
  const sizeText =
    size === undefined
      ? null
      : size < 1024
        ? `${size} B`
        : size < 1024 * 1024
          ? `${(size / 1024).toFixed(1)} KB`
          : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/60 group">
      <span className="text-zinc-400">
        <FileIcon />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate text-zinc-200 max-w-[140px]">
          {filename}
        </span>
        {sizeText && (
          <span className="text-[10px] text-zinc-500 font-mono">
            {sizeText}
          </span>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove file"
          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <XIcon size={10} />
        </button>
      )}
    </div>
  );
}

export function InputBar({
  onSend,
  onStop,
  status = "ready",
  placeholder = "Ketik instruksi atau prompt...",
  attachments,
  className,
  value: controlledValue,
  onChange,
  disabled,
}: {
  onSend?: (m: { role: "user"; content: string }) => void;
  onStop?: () => void;
  status?: ChatStatus;
  placeholder?: string;
  attachments?: AgentChatProps["attachments"];
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  const [internal, setInternal] = useState("");
  const isControlled = controlledValue !== undefined;
  const input = isControlled ? controlledValue : internal;
  const setInput = useCallback(
    (v: string) => {
      if (isControlled) onChange?.(v);
      else setInternal(v);
    },
    [isControlled, onChange],
  );
  const ref = useRef<HTMLTextAreaElement>(null);
  const isStreaming = status === "streaming" || status === "submitted";
  const hasInput = input.trim().length > 0;

  const images = attachments?.images ?? [];
  const files = attachments?.files ?? [];
  const hasContext = images.length > 0 || files.length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0";
    const next = Math.min(el.scrollHeight, 120);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
  }, [input]);

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend?.({ role: "user", content: trimmed });
    setInput("");
  }, [input, isStreaming, disabled, onSend, setInput]);

  return (
    <div className={cn("shrink-0 px-3 pb-3 w-full", className)}>
      <div className="mx-auto w-full">
        <div
          className="relative cursor-text rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-md focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all"
          onClick={(e) => {
            if (
              e.target === e.currentTarget ||
              !(e.target as HTMLElement).closest("button, textarea")
            ) {
              ref.current?.focus();
            }
          }}
        >
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-200 ease-out",
              hasContext ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              {hasContext && (
                <div className="flex flex-wrap items-center gap-1.5 px-2.5 pt-2.5 pb-0.5 border-b border-zinc-800/50">
                  {images.map((img) => (
                    <ImageChip
                      key={img.id}
                      url={img.url}
                      onRemove={
                        attachments?.onRemoveImage
                          ? () => attachments.onRemoveImage!(img.id)
                          : undefined
                      }
                    />
                  ))}
                  {files.map((f) => (
                    <FileChip
                      key={f.id}
                      filename={f.filename}
                      size={f.size}
                      onRemove={
                        attachments?.onRemoveFile
                          ? () => attachments.onRemoveFile!(f.id)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2.5 pb-0 pr-3 pl-3.5 min-h-[44px]">
            <textarea
              ref={ref}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent border-0 outline-none text-xs sm:text-sm leading-[1.6] text-zinc-100 placeholder:text-zinc-500 overflow-hidden font-sans",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-3 px-2.5 pt-1 pb-2">
            <div className="flex items-center gap-1 min-w-0">
              {attachments?.onAttach && (
                <button
                  type="button"
                  onClick={attachments.onAttach}
                  aria-label="Lampirkan Dokumen / Gambar"
                  title="Lampirkan Dokumen / Gambar"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <PaperclipIcon />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={isStreaming ? "Hentikan Proses" : "Kirim Pesan"}
                onClick={() => {
                  if (isStreaming) onStop?.();
                  else if (hasInput) submit();
                }}
                disabled={!isStreaming && !hasInput}
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer shadow-sm",
                  isStreaming
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : hasInput
                    ? "bg-white hover:bg-zinc-200 text-zinc-950 font-bold"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed",
                )}
              >
                {isStreaming ? <StopIcon /> : <SendIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const AgentChat = memo(function AgentChat({
  messages,
  onSend,
  onStop,
  status = "ready",
  error,
  emptyStatePosition = "default",
  attachments,
  placeholder = "Ketik instruksi atau prompt...",
  className,
  headerWidget,
  footerWidget,
  inputValue,
  onInputChange,
  disabled
}: AgentChatProps) {
  const [draft, setDraft] = useState("");
  const currentInput = inputValue !== undefined ? inputValue : draft;
  const setCurrentInput = onInputChange || setDraft;

  const messagesWithError: AgentMessage[] = useMemo(() => {
    if (!error) return messages;
    return [
      ...messages,
      {
        id: "agent-chat-error",
        role: "assistant" as const,
        parts: [
          {
            type: "error" as const,
            title: error.title ?? "Request failed",
            message: error.message,
          },
        ],
      },
    ];
  }, [messages, error]);

  const isEmpty = !error && messages.length === 0;
  const isCenteredEmpty = isEmpty && emptyStatePosition === "center";

  const inputBarNode: ReactNode = (
    <InputBar
      onSend={onSend}
      onStop={onStop}
      status={status}
      attachments={attachments}
      placeholder={placeholder}
      value={currentInput}
      onChange={setCurrentInput}
      disabled={disabled}
      className={isCenteredEmpty ? "px-0 pb-0" : undefined}
    />
  );

  return (
    <div className={cn("flex flex-col h-full min-h-0 bg-zinc-950", className)}>
      {isCenteredEmpty ? (
        <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-4">
          <div className="w-full max-w-[640px]">{inputBarNode}</div>
        </div>
      ) : (
        <MessageList
          messages={messagesWithError}
          headerWidget={headerWidget}
          footerWidget={footerWidget}
        />
      )}
      {!isCenteredEmpty && inputBarNode}
    </div>
  );
});

export default AgentChat;
