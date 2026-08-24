import React from 'react';
import { Result, Button } from 'antd';
import { AlertTriangle } from 'lucide-react';

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Registry Communication Fault',
  message = 'Unable to connect to the Unstray Registry. Please check your network connection and try again.',
  onRetry,
  onGoBack,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        width: '100%',
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `6px 6px 0px ${ink}`,
          padding: '36px 24px',
          textAlign: 'center',
        }}
      >
        <Result
          icon={
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <AlertTriangle size={44} style={{ color: claimRed }} />
            </div>
          }
          title={
            <span
              style={{
                fontFamily: displayFont,
                color: ink,
                fontWeight: 700,
                fontSize: '22px',
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </span>
          }
          subTitle={
            <span
              style={{
                fontFamily: bodyFont,
                color: inkSoft,
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {message}
            </span>
          }
          extra={
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
              {onGoBack && (
                <Button
                  onClick={onGoBack}
                  style={{
                    borderRadius: 0,
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    color: ink,
                    fontFamily: monoFont,
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    height: '40px',
                    padding: '0 20px',
                  }}
                >
                  Go Back
                </Button>
              )}
              {onRetry && (
                <Button
                  type="primary"
                  onClick={onRetry}
                  style={{
                    borderRadius: 0,
                    backgroundColor: ink,
                    borderColor: ink,
                    color: paperLight,
                    fontFamily: monoFont,
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    height: '40px',
                    padding: '0 20px',
                    boxShadow: `2px 2px 0px ${brass}`,
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          }
          style={{ padding: 0 }}
        />
      </div>
    </div>
  );
};

export default ErrorState;