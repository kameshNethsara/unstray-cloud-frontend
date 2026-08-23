import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const claimRed = "#A23E2E";  // LOST / Danger tag accent
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  okText = 'Confirm Action',
  cancelText = 'Cancel',
  confirmLoading = false,
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(32, 48, 58, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        fontFamily: bodyFont
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          borderTop: `6px solid ${danger ? claimRed : brass}`,
          boxShadow: `8px 8px 0px ${ink}`,
          padding: '32px 28px',
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

        {/* HEADER ICON & SUBHEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {danger ? (
            <AlertTriangle size={20} style={{ color: claimRed }} />
          ) : (
            <ShieldAlert size={20} style={{ color: brass }} />
          )}
          <span
            style={{
              fontFamily: monoFont,
              fontSize: '11px',
              letterSpacing: '1px',
              color: danger ? claimRed : inkSoft,
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            {danger ? 'CRITICAL DIRECTORY ACTION' : 'REGISTRY CONFIRMATION'}
          </span>
        </div>

        {/* TITLE */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: '22px',
            fontWeight: 700,
            color: ink,
            textTransform: 'uppercase',
            letterSpacing: '-0.3px',
            marginBottom: '12px'
          }}
        >
          {title}
        </div>

        {/* CONTENT MESSAGE */}
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: '14px',
            color: inkSoft,
            lineHeight: 1.5,
            margin: '0 0 28px 0'
          }}
        >
          {content}
        </p>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={confirmLoading}
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              padding: '10px 18px',
              backgroundColor: 'transparent',
              color: ink,
              border: `1px solid ${ink}`,
              cursor: confirmLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '10px 20px',
              backgroundColor: danger ? claimRed : ink,
              color: paperLight,
              border: 'none',
              cursor: confirmLoading ? 'not-allowed' : 'pointer',
              boxShadow: `2px 2px 0px ${brass}`,
              opacity: confirmLoading ? 0.7 : 1,
            }}
          >
            {confirmLoading ? 'Processing...' : okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;