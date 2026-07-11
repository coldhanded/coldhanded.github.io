import { effectsConfig } from "../../../config";

const config = effectsConfig.homeAsciiGlitch;

export function initAboutImageGlitch(): void {
  if (!config.enable || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const root = document.querySelector<HTMLElement>("[data-about-image-root]");

  if (!root) {
    return;
  }

  let idleTimeoutId = 0;
  let frameTimeoutId = 0;
  let burstActive = false;

  const schedule = () => {
    window.clearTimeout(idleTimeoutId);

    if (document.visibilityState !== "visible") {
      return;
    }

    idleTimeoutId = window.setTimeout(trigger, randomBetween(config.minIntervalMs * 0.7, config.maxIntervalMs * 0.8));
  };

  const runFrame = (remainingFrames: number) => {
    if (remainingFrames <= 0) {
      finishBurst();
      return;
    }

    applyFrame(root);
    root.classList.add("is-glitching");
    frameTimeoutId = window.setTimeout(
      () => runFrame(remainingFrames - 1),
      randomBetween(Math.max(42, config.frameMinMs), Math.min(120, config.frameMaxMs + 10))
    );
  };

  const trigger = () => {
    if (burstActive) {
      return;
    }

    burstActive = true;
    runFrame(randomInt(config.burstFrameMin, config.burstFrameMax));
  };

  const finishBurst = () => {
    burstActive = false;
    frameTimeoutId = 0;
    root.classList.remove("is-glitching");
    clearFrame(root);
    schedule();
  };

  const reset = () => {
    window.clearTimeout(idleTimeoutId);
    window.clearTimeout(frameTimeoutId);
    idleTimeoutId = 0;
    frameTimeoutId = 0;
    burstActive = false;
    root.classList.remove("is-glitching");
    clearFrame(root);
  };

  document.addEventListener("visibilitychange", () => {
    reset();

    if (document.visibilityState === "visible") {
      schedule();
    }
  });
  window.addEventListener("pagehide", reset, { once: true });

  schedule();
}

function applyFrame(root: HTMLElement): void {
  const sliceA = randomSlice(7, 30);
  const sliceB = randomSlice(4, 20);

  root.style.setProperty("--about-base-shift-x", `${randomInt(-3, 3)}px`);
  root.style.setProperty("--about-base-shift-y", `${randomInt(-2, 2)}px`);
  root.style.setProperty("--about-glitch-a-top", `${sliceA.top}%`);
  root.style.setProperty("--about-glitch-a-bottom", `${sliceA.bottom}%`);
  root.style.setProperty("--about-glitch-a-shift-x", `${randomInt(-14, 14)}px`);
  root.style.setProperty("--about-glitch-a-shift-y", `${randomInt(-4, 4)}px`);
  root.style.setProperty("--about-glitch-a-opacity", randomBetween(0.38, 0.78).toFixed(2));
  root.style.setProperty("--about-glitch-b-top", `${sliceB.top}%`);
  root.style.setProperty("--about-glitch-b-bottom", `${sliceB.bottom}%`);
  root.style.setProperty("--about-glitch-b-shift-x", `${randomInt(-10, 10)}px`);
  root.style.setProperty("--about-glitch-b-shift-y", `${randomInt(-3, 3)}px`);
  root.style.setProperty("--about-glitch-b-opacity", randomBetween(0.24, 0.58).toFixed(2));
  root.style.setProperty("--about-scan-top", `${randomBetween(4, 88).toFixed(2)}%`);
  root.style.setProperty("--about-scan-height", `${randomBetween(3, 14).toFixed(2)}%`);
  root.style.setProperty("--about-scan-opacity", randomBetween(0.12, 0.3).toFixed(2));
}

function clearFrame(root: HTMLElement): void {
  for (const property of [
    "--about-base-shift-x",
    "--about-base-shift-y",
    "--about-glitch-a-top",
    "--about-glitch-a-bottom",
    "--about-glitch-a-shift-x",
    "--about-glitch-a-shift-y",
    "--about-glitch-a-opacity",
    "--about-glitch-b-top",
    "--about-glitch-b-bottom",
    "--about-glitch-b-shift-x",
    "--about-glitch-b-shift-y",
    "--about-glitch-b-opacity",
    "--about-scan-top",
    "--about-scan-height",
    "--about-scan-opacity"
  ]) {
    root.style.removeProperty(property);
  }
}

function randomSlice(minHeight: number, maxHeight: number): { top: number; bottom: number } {
  const height = randomBetween(minHeight, maxHeight);
  const top = randomBetween(0, Math.max(0, 100 - height));

  return {
    top: Number(top.toFixed(2)),
    bottom: Number((100 - top - height).toFixed(2))
  };
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}
