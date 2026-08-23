import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const { Title, Paragraph } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
// const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag accent
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh', 
        width: '100%',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        padding: '32px 24px',
        fontFamily: bodyFont
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          borderTop: `6px solid ${claimRed}`,
          boxShadow: `8px 8px 0px ${ink}`,
          padding: '48px 36px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Grommet Accent */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '14px',
            height: '14px',
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
            padding: '12px',
            border: `2px solid ${claimRed}`,
            color: claimRed,
            marginBottom: '20px',
            transform: 'rotate(-2deg)'
          }}
        >
          <Compass size={36} />
        </div>

        {/* LEDGER FILE ERROR CODE */}
        <div
          style={{
            fontFamily: monoFont,
            fontSize: '12px',
            letterSpacing: '2px',
            color: inkSoft,
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}
        >
          Registry File Error // Code 404
        </div>

        <Title
          level={1}
          style={{
            fontFamily: displayFont,
            fontSize: '42px',
            fontWeight: 700,
            color: ink,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px'
          }}
        >
          Unregistered Route
        </Title>

        <Paragraph
          style={{
            fontFamily: bodyFont,
            fontSize: '15px',
            color: inkSoft,
            lineHeight: 1.6,
            marginBottom: '32px'
          }}
        >
          The page or file path you are attempting to locate is not recorded in the Unstray directory ledger.
        </Paragraph>

        {/* ACTION BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
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
              padding: '14px 28px',
              backgroundColor: ink,
              color: paperLight,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `4px 4px 0px ${brass}`
            }}
          >
            <ArrowLeft size={16} /> Return To Registry Desk
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;