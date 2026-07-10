import { useState, useRef, useCallback, useEffect } from 'react';

interface AnimationEngineOptions {
  visitedOrder: string[];
  optimalPath: string[];
  speedMs: number;
}

interface AnimationEngineResult {
  currentStep: number;
  isAnimating: boolean;
  isComplete: boolean;
  animatedNodes: Set<string>;
  animatedPath: string[];
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setStep: (step: number) => void;
}

export function useAnimationEngine({
  visitedOrder,
  optimalPath,
  speedMs,
}: AnimationEngineOptions): AnimationEngineResult {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = visitedOrder.length;

  const isComplete = currentStep >= totalSteps && totalSteps > 0;

  const animatedNodes = new Set(visitedOrder.slice(0, currentStep));
  const animatedPath = isComplete ? optimalPath : [];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    setIsAnimating(true);
  }, [totalSteps]);

  const pause = useCallback(() => {
    setIsAnimating(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsAnimating(false);
    setCurrentStep(0);
    clearTimer();
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const setStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps)));
  }, [totalSteps]);

  useEffect(() => {
    if (!isAnimating) return;
    if (currentStep >= totalSteps) {
      setIsAnimating(false);
      return;
    }
    intervalRef.current = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, speedMs);
    return () => clearTimer();
  }, [isAnimating, currentStep, speedMs, totalSteps, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    currentStep,
    isAnimating,
    isComplete,
    animatedNodes,
    animatedPath,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setStep,
  };
}
