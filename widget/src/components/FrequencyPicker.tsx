import React, { useState, useCallback } from 'react';

interface FrequencyPickerProps {
  frequencies: Array<{ value: string; label: string }>;
  defaultFrequency: string;
  discountPercent: number;
  onChange: (frequency: string) => void;
}

/**
 * Subscription frequency picker for SUBSCRIPTION bundles.
 * Renders delivery interval options (e.g., "Every 2 weeks", "Monthly").
 */
export function FrequencyPicker({
  frequencies,
  defaultFrequency,
  discountPercent,
  onChange,
}: FrequencyPickerProps): React.ReactElement {
  const [selected, setSelected] = useState(defaultFrequency);

  const handleSelect = useCallback(
    (value: string) => {
      setSelected(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <div className="sb-freq" role="group" aria-label="Delivery frequency">
      <div className="sb-freq__header">
        <span className="sb-freq__label">Delivery Frequency</span>
        {discountPercent > 0 && (
          <span className="sb-freq__discount">
            Save {discountPercent}% with subscription
          </span>
        )}
      </div>
      <div className="sb-freq__options" role="radiogroup">
        {frequencies.map((freq) => (
          <div
            key={freq.value}
            className={`sb-freq__option ${selected === freq.value ? 'sb-freq__option--selected' : ''}`}
            role="radio"
            aria-checked={selected === freq.value}
            tabIndex={0}
            onClick={() => handleSelect(freq.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(freq.value);
              }
            }}
          >
            <span className="sb-freq__radio-dot" aria-hidden="true" />
            <span className="sb-freq__option-label">{freq.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
