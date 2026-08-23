import React from 'react';
import { Typography } from 'antd';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

const { Paragraph } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const claimRed = "#A23E2E";  // LOST tag accent
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
  title = 'Registry Network Disruption',
  message = 'Unable to connect to the Unstray directory. Please verify your connection and attempt to re-sync.',
  onRetry,
  onGoBack,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        width: '100%',
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          borderTop: `6px solid ${claimRed}`,
          boxShadow: `8px 8px 0px ${ink}`,
          padding: '40px 32px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Grommet Accent */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: `2px solid ${brass}`,
            backgroundColor: paper,
          }}
        />

        {/* STAMP BADGE */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            border: `2px solid ${claimRed}`,
            color: claimRed,
            marginBottom: '16px',
            transform: 'rotate(-2deg)',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        {/* SUBHEADER TAG */}
        <div
          style={{
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '1.5px',
            color: claimRed,
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontWeight: 700,
          }}
        >
          SYSTEM EXCEPTION // LEDGER ACCESS ERROR
        </div>

        {/* TITLE */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: '26px',
            fontWeight: 700,
            color: ink,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            marginBottom: '10px',
          }}
        >
          {title}
        </div>

        {/* MESSAGE */}
        <Paragraph
          style={{
            fontFamily: bodyFont,
            fontSize: '14px',
            color: inkSoft,
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          {message}
        </Paragraph>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: ink,
                border: `1px solid ${ink}`,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={14} /> Go Back
            </button>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                padding: '10px 20px',
                backgroundColor: ink,
                color: paperLight,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `3px 3px 0px ${brass}`,
              }}
            >
              <RefreshCw size={14} /> Re-Sync Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;