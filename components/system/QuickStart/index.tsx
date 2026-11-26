import { type ReactNode, useCallback, useEffect, useState } from "react";
import SidAvatar from "components/apps/SidBot/SidAvatar";
import StyledQuickStart from "components/system/QuickStart/StyledQuickStart";
import { useProcessesActions } from "contexts/process";

type QuickStartStep = "intro" | "recruiter";

const RESUME_PATH = "/Users/Public/Desktop/Resume.pdf";
const RECRUITER_QUERY =
  "Give a crisp 4-bullet summary of Siddharth's Applied AI, RAG, and production engineering impact.";

const QuickStart = (): ReactNode => {
  const { open } = useProcessesActions();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<QuickStartStep>("intro");

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setVisible(true);
    }, 1100);

    return () => window.clearTimeout(timerId);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const handleRecruiter = useCallback(() => {
    const isDesktopViewport = window.innerWidth >= 900;

    open("PDF", {
      ...(isDesktopViewport
        ? { initialRelativePosition: { left: 28, top: 28 } }
        : {}),
      url: RESUME_PATH,
    });
    open("SidBot", {
      ...(isDesktopViewport
        ? {
            initialRelativePosition: {
              left: Math.max(24, window.innerWidth - 780 - 28),
              top: window.innerHeight < 660 ? 24 : 48,
            },
          }
        : {}),
      initialQuery: RECRUITER_QUERY,
    });
    setStep("recruiter");
  }, [open]);

  const handleChatSidBot = useCallback(() => {
    open("SidBot");
    setVisible(false);
  }, [open]);

  const handleOpenResume = useCallback(() => {
    open("PDF", { url: RESUME_PATH });
    setVisible(false);
  }, [open]);

  const handleOpenPinball = useCallback(() => {
    open("SpaceCadet");
  }, [open]);

  const handleOpenMinecraft = useCallback(() => {
    open("ClassiCube");
  }, [open]);

  return visible ? (
    <StyledQuickStart aria-label="SidOS QuickStart Assistant" role="region">
      <div className="qs-top">
        <div className="qs-identity">
          <div className="qs-avatar">
            <SidAvatar mood={step === "recruiter" ? "hyped" : "idle"} />
          </div>
          <div className="qs-title-wrap">
            <div className="qs-title-row">
              <h2 className="qs-title">SidBot 9000</h2>
              <span className="qs-badge">
                {step === "recruiter" ? "Recruiter Tour" : "OS Guide"}
              </span>
            </div>
            <span className="qs-subtitle">
              Applied AI &amp; Systems Portfolio
            </span>
          </div>
        </div>
        <button
          aria-label="Dismiss assistant"
          className="qs-close"
          onClick={handleDismiss}
          type="button"
        >
          ×
        </button>
      </div>

      {step === "intro" ? (
        <>
          <p className="qs-message">
            Hey! I&apos;m SidBot 9000, Siddharth&apos;s AI assistant. Pick a
            shortcut below or explore his socials, Resume, and apps right on the
            desktop.
          </p>
          <div className="qs-actions">
            <button
              className="qs-pill"
              data-primary="true"
              onClick={handleRecruiter}
              type="button"
            >
              I&apos;m a recruiter
            </button>
            <button
              className="qs-pill"
              onClick={handleChatSidBot}
              type="button"
            >
              Chat with SidBot 9000
            </button>
            <button
              className="qs-pill"
              onClick={handleOpenResume}
              type="button"
            >
              Open Resume
            </button>
            <button className="qs-pill" onClick={handleDismiss} type="button">
              Explore Desktop
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="qs-message">
            Opened Sid&apos;s Resume and primed SidBot with his 30-second
            summary! Feel free to stay and explore — check out his socials on
            the desktop, or play classics like Windows XP 3D Pinball and
            Minecraft.
          </p>
          <div className="qs-actions">
            <button
              className="qs-pill"
              onClick={handleOpenPinball}
              type="button"
            >
              Play XP Pinball
            </button>
            <button
              className="qs-pill"
              onClick={handleOpenMinecraft}
              type="button"
            >
              Play Minecraft
            </button>
            <button
              className="qs-pill"
              data-primary="true"
              onClick={handleDismiss}
              type="button"
            >
              Got it
            </button>
          </div>
        </>
      )}
    </StyledQuickStart>
  ) : (
    false
  );
};

export default QuickStart;
