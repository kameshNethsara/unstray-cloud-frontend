import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft } from 'lucide-react';

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
        minHeight: '85vh', 
        width: '100%',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        padding: '32px 16px',
        fontFamily: bodyFont,
      }}
    >
      {/* 404 CLAIM TICKET / LEDGER FILE */}
      <div
        style={{
          position: 'relative',
          maxWidth: '520px',
          width: '100%',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          padding: '40px 28px',
          boxShadow: `6px 6px 0px ${ink}`,
          textAlign: 'center',
        }}
      >
        {/* BRASS GROMMET ACCENT */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: `2px solid ${brass}`,
            background: paper,
          }}
        />

        {/* HEADER LEDGER BANNER */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '1px',
            color: inkSoft,
            textTransform: 'uppercase',
            marginBottom: '16px',
            paddingBottom: '6px',
            borderBottom: `1px dashed ${inkSoft}`,
            width: '100%',
          }}
        >
          <Tag size={12} />
          Unstray Registry — Missing File Record
        </div>

        <Result
          status="404"
          title={
            <span
              style={{
                fontFamily: displayFont,
                fontSize: '72px',
                fontWeight: 700,
                color: claimRed,
                letterSpacing: '-1px',
                lineHeight: 1,
                display: 'block',
              }}
            >
              404
            </span>
          }
          subTitle={
            <span
              style={{
                color: inkSoft,
                fontSize: '15px',
                display: 'block',
                marginTop: '12px',
                fontFamily: bodyFont,
                lineHeight: 1.6,
              }}
            >
              Sorry, the file or case page you visited does not exist in the <strong style={{ color: ink }}>Unstray</strong> registry.
            </span>
          }
          extra={
            <Button 
              type="primary" 
              onClick={() => navigate('/')} 
              size="large"
              icon={<ArrowLeft size={16} style={{ marginRight: '6px' }} />}
              style={{
                fontFamily: monoFont,
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '12px',
                backgroundColor: ink,
                borderColor: ink,
                color: paperLight,
                borderRadius: 0,
                height: '46px',
                padding: '0 28px',
                boxShadow: `3px 3px 0px ${brass}`,
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Back to Registry Home
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default NotFound;