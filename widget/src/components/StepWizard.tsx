import React, { useState, useCallback } from 'react';

interface StepWizardProps {
  steps: Array<{
    label: string;
    content: React.ReactNode;
    isValid: boolean;
  }>;
  onComplete: () => void;
  completeLabel?: string;
}

/**
 * Multi-step wizard for complex bundle types.
 * Renders step indicators, navigation buttons, and step content.
 */
export function StepWizard({
  steps,
  onComplete,
  completeLabel = 'Add to Cart',
}: StepWizardProps): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className="sb-wizard">
      {/* Step indicators */}
      <div className="sb-wizard__steps" role="tablist">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className={`sb-wizard__step ${isCurrent ? 'sb-wizard__step--current' : ''} ${isCompleted ? 'sb-wizard__step--completed' : ''}`}
              role="tab"
              aria-selected={isCurrent}
            >
              <span className="sb-wizard__step-number">
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="sb-wizard__step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="sb-wizard__content" role="tabpanel">
        {currentStepData.content}
      </div>

      {/* Navigation */}
      <div className="sb-wizard__nav">
        {!isFirstStep && (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--back"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        <div className="sb-wizard__nav-spacer" />
        {isLastStep ? (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--complete"
            onClick={onComplete}
            disabled={!currentStepData.isValid}
          >
            {completeLabel}
          </button>
        ) : (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--next"
            onClick={handleNext}
            disabled={!currentStepData.isValid}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
