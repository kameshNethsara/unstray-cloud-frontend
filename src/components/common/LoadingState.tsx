import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
// const brass = "#A9884F";     // grommet / hardware accent

const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading file records...', fullPage = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: fullPage ? '80vh' : '250px',
        width: '100%',
        backgroundColor: fullPage ? paper : 'transparent',
        backgroundImage: fullPage ? paperTexture : 'none',
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          padding: '24px 36px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `4px 4px 0px ${ink}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Spin size="large" />
        <Text
          style={{
            fontSize: '12px',
            fontFamily: monoFont,
            color: inkSoft,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 600,
          }}
        >
          {message}
        </Text>
      </div>
    </div>
  );
};

export default LoadingState;