import React from 'react';
import { Modal } from 'antd';

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

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  okText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  onConfirm,
  onCancel,
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      title={
        <span
          style={{
            fontFamily: displayFont,
            color: ink,
            fontWeight: 700,
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </span>
      }
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{
        danger: danger,
        type: 'primary',
        style: {
          borderRadius: 0,
          backgroundColor: danger ? claimRed : ink,
          borderColor: danger ? claimRed : ink,
          color: paperLight,
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: '12px',
          textTransform: 'uppercase',
          height: '38px',
          padding: '0 20px',
          boxShadow: `2px 2px 0px ${brass}`,
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: 0,
          backgroundColor: paper,
          border: `1.5px solid ${ink}`,
          color: ink,
          fontFamily: monoFont,
          fontWeight: 600,
          fontSize: '12px',
          textTransform: 'uppercase',
          height: '38px',
          padding: '0 20px',
        },
      }}
      destroyOnClose
      modalRender={(modal) => (
        <div
          style={{
            backgroundColor: paperLight,
            border: `2px solid ${ink}`,
            boxShadow: `8px 8px 0px ${ink}`,
            padding: '24px',
          }}
        >
          {modal}
        </div>
      )}
    >
      <p
        style={{
          fontSize: '14px',
          fontFamily: bodyFont,
          color: inkSoft,
          margin: '16px 0 24px 0',
          lineHeight: 1.5,
        }}
      >
        {content}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;