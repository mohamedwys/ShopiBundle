import React, { useState, useCallback } from 'react';
import { formatPrice } from '../utils/formatting';

interface GiftOptionsProps {
  allowMessage: boolean;
  maxMessageLength: number;
  allowWrapping: boolean;
  wrappingOptions: Array<{ id: string; name: string; price: number; imageUrl?: string }>;
  moneyFormat: string;
  onGiftMessageChange: (message: string) => void;
  onWrappingChange: (wrappingId: string | null) => void;
}

export function GiftOptions({
  allowMessage,
  maxMessageLength,
  allowWrapping,
  wrappingOptions,
  moneyFormat,
  onGiftMessageChange,
  onWrappingChange,
}: GiftOptionsProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value.slice(0, maxMessageLength);
      setMessage(val);
      onGiftMessageChange(val);
    },
    [maxMessageLength, onGiftMessageChange]
  );

  const handleWrappingSelect = useCallback(
    (wrappingId: string | null) => {
      setSelectedWrapping(wrappingId);
      onWrappingChange(wrappingId);
    },
    [onWrappingChange]
  );

  return (
    <div className="sb-gift" role="group" aria-label="Gift options">
      {allowMessage && (
        <div className="sb-gift__message">
          <label className="sb-gift__label" htmlFor="sb-gift-message">
            Gift Message
          </label>
          <textarea
            id="sb-gift-message"
            className="sb-gift__textarea"
            value={message}
            onChange={handleMessageChange}
            placeholder="Write a personal message..."
            maxLength={maxMessageLength}
            rows={3}
          />
          <span className="sb-gift__char-count">
            {message.length}/{maxMessageLength}
          </span>
        </div>
      )}

      {allowWrapping && wrappingOptions.length > 0 && (
        <div className="sb-gift__wrapping">
          <span className="sb-gift__label">Gift Wrapping</span>
          <div className="sb-gift__wrapping-options" role="radiogroup" aria-label="Gift wrapping options">
            <div
              className={`sb-gift__wrapping-option ${selectedWrapping === null ? 'sb-gift__wrapping-option--selected' : ''}`}
              role="radio"
              aria-checked={selectedWrapping === null}
              tabIndex={0}
              onClick={() => handleWrappingSelect(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWrappingSelect(null); } }}
            >
              <span className="sb-gift__wrapping-name">No wrapping</span>
              <span className="sb-gift__wrapping-price">Free</span>
            </div>
            {wrappingOptions.map((opt) => (
              <div
                key={opt.id}
                className={`sb-gift__wrapping-option ${selectedWrapping === opt.id ? 'sb-gift__wrapping-option--selected' : ''}`}
                role="radio"
                aria-checked={selectedWrapping === opt.id}
                tabIndex={0}
                onClick={() => handleWrappingSelect(opt.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWrappingSelect(opt.id); } }}
              >
                {opt.imageUrl && (
                  <img className="sb-gift__wrapping-img" src={opt.imageUrl} alt={opt.name} width="40" height="40" loading="lazy" />
                )}
                <span className="sb-gift__wrapping-name">{opt.name}</span>
                <span className="sb-gift__wrapping-price">
                  +{formatPrice(opt.price, moneyFormat)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
