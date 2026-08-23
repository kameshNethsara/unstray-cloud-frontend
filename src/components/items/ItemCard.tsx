import React from 'react';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag as CategoryIcon, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Item } from '../../types/item';

dayjs.extend(relativeTime);
const { Title, Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
// const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { id, title, type, category, status, location, media, createdAt } = item;
  
  const isLost = type === 'LOST';
  const isOpen = status === 'OPEN';
  const itemImage = media && media.length > 0 
    ? media[0] 
    : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        fontFamily: bodyFont,
        backgroundColor: paperLight,
      }}
    >
      <div>
        {/* MEDIA PREVIEW WITH STAMP BADGES */}
        <div 
          style={{ 
            position: 'relative', 
            height: '180px', 
            overflow: 'hidden', 
            border: `1px solid ${ink}`,
            marginBottom: '12px'
          }}
        >
          <img
            alt={title}
            src={itemImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(95%) grayscale(5%)',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* STAMP BADGES */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
            <div 
              style={{ 
                margin: 0, 
                fontFamily: monoFont,
                fontWeight: 700, 
                fontSize: '10px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '3px 8px',
                color: isLost ? claimRed : claimGreen,
                border: `2px solid ${isLost ? claimRed : claimGreen}`,
                backgroundColor: paperLight,
                boxShadow: `2px 2px 0px ${ink}`,
                transform: 'rotate(-2deg)'
              }}
            >
              ● {type}
            </div>

            <div 
              style={{ 
                margin: 0, 
                fontFamily: monoFont,
                fontWeight: 700, 
                fontSize: '10px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '3px 8px',
                color: isOpen ? ink : inkSoft,
                border: `1px solid ${ink}`,
                backgroundColor: isOpen ? paperDeep : paperLight,
                boxShadow: `2px 2px 0px ${ink}`
              }}
            >
              {status}
            </div>
          </div>
        </div>

        {/* CATEGORY & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <CategoryIcon size={12} style={{ color: brass }} />
          <Text style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 600, color: inkSoft, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {category}
          </Text>
        </div>
        
        <Title 
          level={5} 
          ellipsis={{ rows: 2 }} 
          style={{ 
            fontFamily: displayFont,
            margin: '0 0 10px 0', 
            fontSize: '18px', 
            fontWeight: 700, 
            lineHeight: 1.25,
            color: ink,
            textTransform: 'uppercase',
            letterSpacing: '-0.3px'
          }}
        >
          {title}
        </Title>

        {/* METADATA: LOCATION & DATE */}
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: inkSoft, fontSize: '12px' }}>
            <MapPin size={13} style={{ flexShrink: 0, color: claimRed }} />
            <Text ellipsis style={{ margin: 0, fontFamily: bodyFont, fontSize: '13px', color: ink }}>
              {location}
            </Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: inkSoft, fontSize: '12px' }}>
            <Calendar size={13} style={{ flexShrink: 0, color: brass }} />
            <Text style={{ margin: 0, fontFamily: monoFont, fontSize: '11px', color: inkSoft }}>
              FILED {dayjs(createdAt).fromNow().toUpperCase()}
            </Text>
          </div>
        </Space>
      </div>

      {/* VIEW DETAILS BUTTON — Ledger Action Style */}
      <Link to={`/items/${id}`} style={{ width: '100%', display: 'block' }}>
        <button
          style={{ 
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px',
            fontFamily: monoFont,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '10px 14px',
            backgroundColor: ink,
            color: paperLight,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `2px 2px 0px ${brass}`
          }}
        >
          Inspect Record <ArrowRight size={13} />
        </button>
      </Link>
    </div>
  );
};

export default ItemCard;