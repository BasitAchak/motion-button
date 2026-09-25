import React, { useCallback, useEffect, useRef, useState } from "react";

const RESULT_VISIBLE_MS = 1200;
const SUCCESS_LABEL_MS = 850;

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

function CheckIcon() {
  return (
    <svg className="icon check-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7.5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="icon error-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v6" />
      <path d="M12 17.2h.01" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="icon send-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 4 16 8-16 8 3.5-8L4 4Z" />
      <path d="M7.5 12H20" />
    </svg>
  );
}

function MotionButton({ mode = "random", label = "Send message" }) {
  const [status, setStatus] = useState("idle");
  const timerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback(
    (forcedResult = null) => {
      if (status === "loading") return;

      clearTimers();
      setStatus("loading");

      const delay = 650 + Math.floor(Math.random() * 1050);
      const shouldFail =
        forcedResult === "error"
          ? true
          : forcedResult === "success"
            ? false
            : Math.random() < 0.2;

      timerRef.current = setTimeout(() => {
        setStatus(shouldFail ? "error" : "success");

        timerRef.current = setTimeout(() => {
          setStatus("idle");
        }, RESULT_VISIBLE_MS);
      }, delay);
    },
    [clearTimers, status]
  );

  const retry = () => run("success");

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  const buttonClass = [
    "motion-button",
    `status-${status}`,
    isError ? "shake" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const text =
    isLoading ? "Sending..." : isSuccess ? "Sent" : isError ? "Retry" : label;

  return (
    <button
      className={buttonClass}
      type="button"
      disabled={isLoading}
      aria-live="polite"
      aria-busy={isLoading}
      onClick={() => (isError ? retry() : run(mode))}
    >
      <span className="button-content">
        <span className="button-icon" key={`${status}-icon`}>
          {isLoading ? (
            <Spinner />
          ) : isSuccess ? (
            <CheckIcon />
          ) : isError ? (
            <ErrorIcon />
          ) : (
            <SendIcon />
          )}
        </span>
        <span className="button-label" key={`${status}-label`}>
          {text}
        </span>
      </span>
    </button>
  );
}

function App() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">WEEK 6 · MOTION & INTERACTION</p>
        <h1>One button, every state.</h1>
        <p className="intro">
          An AI chat send button designed as a stateful interaction instead
          of a static control.
        </p>
      </section>

      <section className="demo-grid" aria-label="Motion button demonstrations">
        <article className="demo-card primary-card">
          <div className="card-heading">
            <div>
              <span className="card-kicker">20% RANDOM FAILURE</span>
              <h2>Send message</h2>
            </div>
            <span className="status-pill">LIVE DEMO</span>
          </div>

          <p className="card-copy">
            Hover or focus the button, then click it. The fake async request
            randomly succeeds or fails after a short delay.
          </p>

          <div className="button-stage">
            <MotionButton />
          </div>

          <div className="state-list" aria-label="Button states">
            <span>Idle</span>
            <span>Hover / Focus</span>
            <span>Loading</span>
            <span>Success</span>
            <span>Error</span>
          </div>
        </article>

        <article className="demo-card controls-card">
          <div className="card-heading">
            <div>
              <span className="card-kicker">DEMO CONTROLS</span>
              <h2>Test every outcome</h2>
            </div>
          </div>

          <p className="card-copy">
            These triggers make the success and failure states deterministic
            for testing and screenshots.
          </p>

          <div className="control-row">
            <MotionButton mode="success" label="Force success" />
            <MotionButton mode="error" label="Force error" />
          </div>

          <div className="accessibility-note">
            <strong>Keyboard + reduced motion</strong>
            <span>
              Use Tab + Enter/Space to operate the controls. Motion is reduced
              automatically when the system requests reduced motion.
            </span>
          </div>
        </article>
      </section>

      <section className="motion-note">
        <div>
          <span className="card-kicker">MOTION SYSTEM</span>
          <h2>Why these timings?</h2>
        </div>
        <p>
          Interactive hover/focus feedback uses roughly 180–220ms with an
          ease-out curve so it feels immediate. Loading and result transitions
          use 250–350ms so the state change is readable without slowing the
          interaction. The implementation animates transform and opacity
          rather than layout properties. Error feedback is a short shake and
          is removed under <code>prefers-reduced-motion</code>, while the
          persistent error styling remains.
        </p>
      </section>

      <footer>
        <span>React + CSS</span>
        <span>·</span>
        <span>Week 6 Assignment</span>
      </footer>
    </main>
  );
}

export default App;