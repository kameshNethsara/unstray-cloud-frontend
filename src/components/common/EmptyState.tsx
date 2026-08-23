import React from 'react';
import { FolderSearch, PlusCircle } from 'lucide-react';

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No registered records found matching your criteria.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem',
        width: '100%',
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: paperLight,
          border: `2px dashed ${ink}`,
          padding: '40px 32px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Grommet Accent */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: `2px solid ${brass}`,
            backgroundColor: paper,
          }}
        />

        {/* SEARCH ICON STAMP */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            border: `2px solid ${ink}`,
            backgroundColor: paper,
            color: inkSoft,
            marginBottom: '16px',
            boxShadow: `3px 3px 0px ${brass}`,
          }}
        >
          <FolderSearch size={28} />
        </div>

        {/* LEDGER TAG */}
        <div
          style={{
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '1.5px',
            color: inkSoft,
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontWeight: 700,
          }}
        >
          REGISTRY DIRECTORY EMPTY
        </div>

        {/* MESSAGE */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: '18px',
            fontWeight: 700,
            color: ink,
            lineHeight: 1.4,
            marginBottom: actionText && onAction ? '24px' : '0',
          }}
        >
          {message}
        </div>

        {/* ACTION BUTTON */}
        {actionText && onAction && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onAction}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '12px 24px',
                backgroundColor: ink,
                color: paperLight,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `3px 3px 0px ${brass}`,
              }}
            >
              <PlusCircle size={15} /> {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;