import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
// const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Consulting Registry Files...', fullPage = false }) => {
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
        fontFamily: bodyFont
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `6px 6px 0px ${ink}`,
          padding: '32px 40px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          position: 'relative'
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

        <div style={{ marginBottom: '1.25rem' }}>
          <Spin size="large" />
        </div>

        <div
          style={{
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '1.5px',
            color: brass,
            textTransform: 'uppercase',
            marginBottom: '4px',
            fontWeight: 700
          }}
        >
          REGISTRY INDEX SEARCHING
        </div>

        <Text
          style={{
            fontFamily: displayFont,
            fontSize: '17px',
            fontWeight: 700,
            color: ink,
            textTransform: 'uppercase',
            letterSpacing: '-0.3px'
          }}
        >
          {message}
        </Text>
      </div>
    </div>
  );
};

export default LoadingState;