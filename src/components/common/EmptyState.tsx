import React from 'react';
import { Empty, Button } from 'antd';
import { FolderX } from 'lucide-react';

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
// const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const brass = "#A9884F";     // grommet / hardware accent

const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No file records match your query.',
  actionText,
  onAction,
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
          maxWidth: '520px',
          width: '100%',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `6px 6px 0px ${ink}`,
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <FolderX size={48} style={{ color: brass }} />
        </div>
        <Empty
          description={
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
          image={false}
          style={{ margin: 0 }}
        >
          {actionText && onAction && (
            <Button
              type="primary"
              onClick={onAction}
              style={{
                marginTop: '20px',
                borderRadius: 0,
                backgroundColor: ink,
                borderColor: ink,
                color: paperLight,
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                height: '40px',
                padding: '0 24px',
                boxShadow: `2px 2px 0px ${brass}`,
              }}
            >
              {actionText}
            </Button>
          )}
        </Empty>
      </div>
    </div>
  );
};

export default EmptyState;