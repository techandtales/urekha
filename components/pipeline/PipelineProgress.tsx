"use client";

import "./pipeline-progress.css";

import React, { useRef, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import {
    type PipelineActions
} from "@/lib/pipeline/constants";
import { ModularOrchestrator } from "@/lib/pipeline/modularOrchestrator";
import type { BaseArgs } from "@/lib/pipeline/constants";
import type { PipelineMessage } from "@/lib/pipeline/pipeline-slice";

// ── Mystic Loading Messages ──

const MYSTIC_MESSAGES = [
  "Aligning celestial nodes...",
  "Calculating planetary dignities...",
  "Mapping karmic pathways...",
  "Analyzing divisional charts...",
  "Parsing Mahadasha sequences...",
  "Extracting cosmic blueprints...",
  "Computing Ashtakavarga strengths...",
  "Activating intelligence core...",
  "Synthesizing Vedic interpretations...",
];

// ── Inline SVG Icons ──

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="60"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="#00FF94"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#FF4444" strokeWidth="2" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="#FF4444"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 4v6h6M23 20v-6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WaitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

// ── Animated Background ──

function AnimatedBackground() {
  return (
    <div className="pipeline-bg">
      <div className="pipeline-orb pipeline-orb--1" />
      <div className="pipeline-orb pipeline-orb--2" />
      <div className="pipeline-orb pipeline-orb--3" />
      <div className="pipeline-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="pipeline-particle" />
        ))}
      </div>
    </div>
  );
}

// ── Circular Progress Ring ──

function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 20; // r=20
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="pipeline-ring">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" className="pipeline-ring__bg" />
        <circle
          cx="24"
          cy="24"
          r="20"
          className="pipeline-ring__fill"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="pipeline-ring__text">{percentage}%</div>
    </div>
  );
}

// ── Group Container Types ──

interface GroupInfo {
  id: string;
  label: string;
  type: "jyotisham" | "predict" | "system";
  messages: PipelineMessage[];
  status: "waiting" | "active" | "complete" | "error";
}

function deriveGroups(messages: PipelineMessage[]): GroupInfo[] {
  const groupMap = new Map<string, PipelineMessage[]>();
  const groupOrder: string[] = [];

  for (const msg of messages) {
    const groupId = msg.group || "system";
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
      groupOrder.push(groupId);
    }
    groupMap.get(groupId)!.push(msg);
  }

  return groupOrder
    .filter((id) => id !== "system") // system messages are rendered separately
    .map((id) => {
      const msgs = groupMap.get(id)!;
      const type = id.startsWith("predict/") ? "predict" : "jyotisham";

      // Derive group status
      const hasError = msgs.some((m) => m.status === "error");
      const allDone = msgs.every(
        (m) => m.status === "success" || m.status === "error"
      );
      const hasPending = msgs.some(
        (m) => m.status === "pending" || m.status === "retrying"
      );

      let status: GroupInfo["status"] = "waiting";
      if (hasPending) status = "active";
      if (allDone && !hasError) status = "complete";
      if (allDone && hasError) status = "error";

      // Generate label from group ID
      let label = id;
      if (id.startsWith("jyotisham/batch_")) {
        const num = id.replace("jyotisham/batch_", "");
        label = `Urekha Batch ${parseInt(num) + 1}`;
      } else if (id === "jyotisham/binnashtakvarga") {
        label = "Binnashtakvarga (7 Planets)";
      } else if (id.startsWith("predict/batch_pred_")) {
        const num = id.replace("predict/batch_pred_", "");
        label = `AI Prediction Batch ${parseInt(num) + 1}`;
      }

      return { id, label, type, messages: msgs, status };
    });
}

// ── Group Container Card ──

function GroupContainer({ group }: { group: GroupInfo }) {
  const completedCount = group.messages.filter(
    (m) => m.status === "success"
  ).length;
  const totalCount = group.messages.length;

  return (
    <div
      className={`group-container group-container--${group.status} ${
        group.type === "predict" ? "group-container--predictions" : ""
      }`}
    >
      <div className="group-header">
        <div className="group-header__left">
          <div
            className={`group-header__indicator group-header__indicator--${group.status}`}
          />
          <span
            className={`group-header__title group-header__title--${group.status}`}
          >
            {group.label}
          </span>
        </div>
        <span
          className={`group-header__badge group-header__badge--${group.status}`}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      {group.type === "predict" ? (
        <div className="prediction-grid">
          {group.messages.map((msg) => {
            let chipClass = "";
            if (msg.status === "success") chipClass = "prediction-chip--success";
            else if (msg.status === "pending" || msg.status === "retrying")
              chipClass = "prediction-chip--processing";
            else if (msg.status === "error") chipClass = "prediction-chip--error";

            return (
              <div key={msg.id} className={`prediction-chip ${chipClass}`}>
                <span className="prediction-chip__icon">
                  {msg.status === "success" && <CheckIcon size={12} />}
                  {(msg.status === "pending" || msg.status === "retrying") && (
                    <SpinnerIcon className="w-3 h-3" />
                  )}
                  {msg.status === "error" && <ErrorIcon size={12} />}
                </span>
                <span>
                  {msg.label
                    .replace("Generating ", "")
                    .replace("...", "")
                    .replace(" Generated ✓", "")
                    .replace(" Failed", "")
                    .replace(" — Timeout", "")}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="group-body">
          {group.messages.map((msg) => {
            const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={msg.id}
                className={`task-row task-row--${msg.status}`}
              >
                <span className="task-row__icon">
                  {msg.status === "success" && <CheckIcon />}
                  {(msg.status === "pending" || msg.status === "retrying") && (
                    <SpinnerIcon />
                  )}
                  {msg.status === "error" && <ErrorIcon />}
                </span>
                <span className="task-row__label">{msg.label}</span>
                <span className="task-row__time">{timeString}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── System Messages Bar ──

function SystemMessages({ messages }: { messages: PipelineMessage[] }) {
  if (messages.length === 0) return null;

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className={`system-msg system-msg--${msg.status}`}>
          <span className="system-msg__dot" />
          <span>{msg.label}</span>
        </div>
      ))}
    </>
  );
}

// ── Error Panel ──

function ErrorPanel({
  onRetry,
  onRetryAll,
}: {
  onRetry: (stepKey: string) => void;
  onRetryAll?: () => void;
}) {
  const errors = useStore((s) => s.pipelineErrors);

  if (errors.length === 0) return null;

  return (
    <div className="pipeline-error-panel">
      <div className="pipeline-error-header">
        <ErrorIcon />
        <span>
          {errors.length} Error{errors.length > 1 ? "s" : ""} Encountered
        </span>
      </div>
      {errors.map((err) => (
        <div key={err.id} className="pipeline-error-card">
          <div className="pipeline-error-card-body">
            <div className="pipeline-error-card-title">{err.label}</div>
            <div className="pipeline-error-card-message">{err.error}</div>
            <div className="pipeline-error-card-meta">
              Retried {err.retryCount} time{err.retryCount !== 1 ? "s" : ""}
            </div>
          </div>
          {err.canRetry && (
            <button
              className="pipeline-retry-btn"
              onClick={() => onRetry(err.step)}
            >
              <RetryIcon />
              <span>Retry</span>
            </button>
          )}
        </div>
      ))}
      {errors.length > 1 && onRetryAll && (
        <div style={{ padding: "0.5rem 0.75rem" }}>
          <button
            style={{
              width: "100%",
              padding: "0.4rem",
              background: "rgba(255, 68, 68, 0.06)",
              border: "1px solid rgba(255, 68, 68, 0.15)",
              borderRadius: "6px",
              color: "#ff6666",
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "var(--pipe-mono)",
              transition: "background 0.2s",
            }}
            onClick={onRetryAll}
          >
            Retry All Failed ({errors.length})
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════

interface PipelineProgressProps {
  args: BaseArgs;
  autoStart?: boolean;
  onViewChart?: () => void;
}

export default function PipelineProgress({
  args,
  autoStart = true,
  onViewChart,
}: PipelineProgressProps) {
  const {
    jyotishamData,
    birthDetails,
    setJyotishamData,
    pushMessage,
    updateMessage,
    pushError,
    removeError,
    incrementCompleted,
    setProgress,
    setPipelineRunning,
    resetPipeline,
    setPrediction,
    pipelineProgress,
    pipelineRunning,
    pipelineErrors,
    pipelineMessages,
  } = useStore();

  const pipelineRef = useRef<ModularOrchestrator | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [mysticMsgIndex, setMysticMsgIndex] = React.useState(0);

  // Build actions object for the orchestrator
  const actions: PipelineActions = useMemo(
    () => ({
      setJyotishamData,
      pushMessage,
      updateMessage,
      pushError,
      removeError,
      incrementCompleted,
      setProgress,
      setPipelineRunning,
      setPrediction,
      resetPipeline,
    }),
    [
      setJyotishamData,
      pushMessage,
      updateMessage,
      pushError,
      removeError,
      incrementCompleted,
      setProgress,
      setPipelineRunning,
      setPrediction,
      resetPipeline,
    ]
  );

  // Create pipeline instance
  useEffect(() => {
    pipelineRef.current = new ModularOrchestrator(args, actions);
  }, [args, actions]);

  // Prevent double execution in React Strict Mode
  const hasStarted = useRef(false);

  // Auto-start
  useEffect(() => {
    if (autoStart && pipelineRef.current && !hasStarted.current) {
      hasStarted.current = true;
      resetPipeline();
      pipelineRef.current.runAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Cycle mystic messages
  const isComplete =
    !pipelineRunning &&
    pipelineProgress.total > 0 &&
    pipelineProgress.completed >= pipelineProgress.total;

  const predictionKeys = Object.keys(jyotishamData.predictions || {});
  const allPredictionsReceived = predictionKeys.every(
    (cat) =>
      jyotishamData.predictions[cat]?.status === "success" ||
      jyotishamData.predictions[cat]?.status === "error"
  );
  const allPredictionsSuccessful = predictionKeys.every(
    (cat) => jyotishamData.predictions[cat]?.status === "success"
  );
  const failedPredictions = predictionKeys.filter(
    (cat) => jyotishamData.predictions[cat]?.status === "error"
  );

  const fullyDone = isComplete && allPredictionsReceived;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!fullyDone) {
      interval = setInterval(() => {
        setMysticMsgIndex((prev) => (prev + 1) % MYSTIC_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [fullyDone]);

  // Auto-scroll grid to bottom on new messages
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = gridRef.current.scrollHeight;
    }
  }, [pipelineMessages.length, pipelineProgress.completed]);

  // Derive groups from messages
  const groups = useMemo(
    () => deriveGroups(pipelineMessages),
    [pipelineMessages]
  );

  const systemMessages = useMemo(
    () => pipelineMessages.filter((m) => (m.group || "system") === "system"),
    [pipelineMessages]
  );

  // Counts
  const successCount = pipelineMessages.filter(
    (m) => m.status === "success"
  ).length;
  const errorCount = pipelineErrors.length;
  const pendingCount = pipelineMessages.filter(
    (m) => m.status === "pending" || m.status === "retrying"
  ).length;

  // Handlers
  const handleRetry = async (stepKey: string) => {
    if (pipelineRef.current) {
      await pipelineRef.current.retryStep(stepKey);
    }
  };

  const [retryingSlug, setRetryingSlug] = React.useState<string | null>(null);

  const handleRetryPrediction = async (slug: string) => {
    if (pipelineRef.current) {
      setRetryingSlug(slug);
      try {
        await pipelineRef.current.retryPrediction(slug);
      } finally {
        setRetryingSlug(null);
      }
    }
  };

  const handleRetryAll = () => {
    const stepKeys = useStore.getState().pipelineErrors.map((e) => e.step);
    const isPrediction = (slug: string) =>
      Object.keys(useStore.getState().jyotishamData.predictions).includes(slug);
    const jyotishamKeys = stepKeys.filter((s) => !isPrediction(s));
    const predictKeys = stepKeys.filter((s) => isPrediction(s));
    if (jyotishamKeys.length > 0 && pipelineRef.current)
      (pipelineRef.current as any).retryJyotishamGroup(jyotishamKeys);
    if (predictKeys.length > 0 && pipelineRef.current)
      (pipelineRef.current as any).retryPredictionGroup(predictKeys);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#050A0A",
      }}
    >
      {/* ── Animated Background ── */}
      <AnimatedBackground />

      {/* ── Header Bar ── */}
      <div className="pipeline-header">
        <ProgressRing
          completed={pipelineProgress.completed}
          total={pipelineProgress.total}
        />
        <div className="pipeline-header__info">
          <h2 className="pipeline-header__title">
            {fullyDone && allPredictionsSuccessful
              ? "✦ Pipeline Complete"
              : "Generating Kundli Intelligence"}
          </h2>
          <p className="pipeline-header__subtitle">
            {fullyDone && allPredictionsSuccessful
              ? "All data compiled successfully"
              : (
                  <>
                    Processing <span>{pipelineProgress.completed}</span> of{" "}
                    <span>{pipelineProgress.total}</span> tasks
                    {birthDetails.username && <> for <span>{birthDetails.username}</span></>}
                  </>
                )}
          </p>
        </div>
        <div className="pipeline-stats">
          <div className="pipeline-stat">
            <span className="pipeline-stat__label">Done</span>
            <span className="pipeline-stat__value pipeline-stat__value--success">
              {successCount}
            </span>
          </div>
          {pendingCount > 0 && (
            <div className="pipeline-stat">
              <span className="pipeline-stat__label">Active</span>
              <span className="pipeline-stat__value pipeline-stat__value--pending">
                {pendingCount}
              </span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="pipeline-stat">
              <span className="pipeline-stat__label">Errors</span>
              <span className="pipeline-stat__value pipeline-stat__value--error">
                {errorCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Birth Details Bar ── */}
      <div className="pipeline-birth-bar">
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">Name</span>
          <span className="pipeline-birth-bar__value pipeline-birth-bar__value--highlight">{birthDetails.username || '—'}</span>
        </div>
        <div className="pipeline-birth-bar__sep" />
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">DOB</span>
          <span className="pipeline-birth-bar__value">{args.date}</span>
        </div>
        <div className="pipeline-birth-bar__sep" />
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">Time</span>
          <span className="pipeline-birth-bar__value">{args.time}</span>
        </div>
        <div className="pipeline-birth-bar__sep" />
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">Coords</span>
          <span className="pipeline-birth-bar__value">{args.latitude.toFixed(2)}°, {args.longitude.toFixed(2)}°</span>
        </div>
        <div className="pipeline-birth-bar__sep" />
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">TZ</span>
          <span className="pipeline-birth-bar__value">UTC{args.tz >= 0 ? '+' : ''}{args.tz}</span>
        </div>
        <div className="pipeline-birth-bar__sep" />
        <div className="pipeline-birth-bar__item">
          <span className="pipeline-birth-bar__label">Lang</span>
          <span className="pipeline-birth-bar__value">{args.lang === 'hi' ? 'Hindi' : 'English'}</span>
        </div>
      </div>

      {/* ── Mystic Message Bar ── */}
      {!fullyDone && (
        <div className="pipeline-mystic">
          <span key={mysticMsgIndex} className="pipeline-mystic__text">
            {MYSTIC_MESSAGES[mysticMsgIndex]}
          </span>
        </div>
      )}

      {/* ── System Messages ── */}
      <SystemMessages messages={systemMessages} />

      {/* ── Grid of Group Containers ── */}
      <div className="pipeline-grid-wrapper" ref={gridRef}>
        {groups.length > 0 ? (
          <div className="pipeline-grid">
            {groups.map((group) => (
              <GroupContainer key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "rgba(255,255,255,0.15)",
              fontStyle: "italic",
              fontSize: "0.8rem",
            }}
          >
            Initializing pipeline...
          </div>
        )}

        {/* Error panel inside grid area */}
        {pipelineErrors.length > 0 && (
          <div style={{ marginTop: "0.5rem" }}>
            <ErrorPanel onRetry={handleRetry} onRetryAll={handleRetryAll} />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {isComplete && (
        <div className="pipeline-footer">
          {!allPredictionsReceived ? (
            <div className="pipeline-footer__status pipeline-footer__status--running">
              <SpinnerIcon className="w-4 h-4" />
              <span>
                Waiting for {predictionKeys.filter((k) => {
                  const s = jyotishamData.predictions[k]?.status;
                  return s !== "success" && s !== "error";
                }).length}{" "}
                AI predictions…
              </span>
            </div>
          ) : allPredictionsSuccessful ? (
            <>
              <div className="pipeline-footer__status pipeline-footer__status--success">
                <CheckIcon />
                <span>
                  All {predictionKeys.length} predictions generated
                </span>
              </div>
              <button
                className="pipeline-footer__btn pipeline-footer__btn--primary"
                onClick={onViewChart}
              >
                View Comprehensive Report
              </button>
            </>
          ) : (
            <>
              <div className="pipeline-footer__status pipeline-footer__status--error">
                <ErrorIcon />
                <span>
                  {failedPredictions.length} of {predictionKeys.length}{" "}
                  predictions failed
                </span>
              </div>
              <button
                className="pipeline-footer__btn pipeline-footer__btn--retry"
                onClick={() => {
                  if (
                    pipelineRef.current &&
                    failedPredictions.length > 0
                  ) {
                    (pipelineRef.current as any).retryPredictionGroup(
                      failedPredictions
                    );
                  }
                }}
                disabled={retryingSlug !== null}
              >
                <RetryIcon />
                Retry Failed ({failedPredictions.length})
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
