import React from 'react';
import { Card, Tag as AntTag, Button, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag as CategoryIcon, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Item } from '../../types/item';

dayjs.extend(relativeTime);
const { Title, Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { id, title, type, category, status, location, imageUrls, createdAt } = item;
  
  const isLost = type === 'LOST';
  const isOpen = status === 'OPEN';
  const itemImage = imageUrls && imageUrls.length > 0 
    ? imageUrls[0] 
    : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80'; // fallback placeholder image for items

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: paperDeep, borderBottom: `2px solid ${ink}` }}>
          <img
            alt={title}
            src={itemImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* BADGES ON COVER */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
            <AntTag 
              style={{ 
                margin: 0, 
                fontWeight: 700, 
                fontFamily: monoFont,
                borderRadius: 0,
                border: `1.5px solid ${isLost ? claimRed : claimGreen}`,
                backgroundColor: paperLight,
                color: isLost ? claimRed : claimGreen,
                padding: '2px 8px',
                fontSize: '11px',
                letterSpacing: '0.5px',
                boxShadow: `2px 2px 0px ${ink}`
              }}
            >
              {type}
            </AntTag>
            <AntTag 
              style={{ 
                margin: 0, 
                fontWeight: 700, 
                fontFamily: monoFont,
                borderRadius: 0,
                border: `1.5px solid ${isOpen ? ink : inkSoft}`,
                backgroundColor: paperLight,
                color: isOpen ? ink : inkSoft,
                padding: '2px 8px',
                fontSize: '11px',
                letterSpacing: '0.5px',
                boxShadow: `2px 2px 0px ${ink}`
              }}
            >
              {status}
            </AntTag>
          </div>
        </div>
      }
      styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', height: '215px', justifyContent: 'space-between' } }}
      style={{ 
        borderRadius: 0, 
        overflow: 'hidden', 
        border: `2px solid ${ink}`,
        backgroundColor: paperLight,
        boxShadow: `4px 4px 0px ${ink}`,
        fontFamily: bodyFont,
      }}
    >
      <div>
        {/* CATEGORY & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <CategoryIcon size={13} style={{ color: brass }} />
          <Text style={{ fontSize: '11px', fontWeight: 600, fontFamily: monoFont, textTransform: 'uppercase', letterSpacing: '0.5px', color: inkSoft }}>
            {category}
          </Text>
        </div>
        
        <Title 
          level={5} 
          ellipsis={{ rows: 2 }} 
          style={{ 
            margin: '0 0 10px 0', 
            fontSize: '16px', 
            fontWeight: 700, 
            fontFamily: displayFont,
            textTransform: 'uppercase',
            lineHeight: 1.25,
            color: ink 
          }}
        >
          {title}
        </Title>

        {/* METADATA: LOCATION & DATE */}
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: inkSoft, fontSize: '12px', fontFamily: monoFont }}>
            <MapPin size={13} style={{ flexShrink: 0, color: brass }} />
            <Text ellipsis style={{ margin: 0, fontSize: '12px', color: inkSoft, fontFamily: monoFont }}>{location}</Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: inkSoft, fontSize: '12px', fontFamily: monoFont }}>
            <Calendar size={13} style={{ flexShrink: 0, color: brass }} />
            <Text style={{ margin: 0, fontSize: '12px', color: inkSoft, fontFamily: monoFont }}>
              Reported {dayjs(createdAt).fromNow()}
            </Text>
          </div>
        </Space>
      </div>

      {/* VIEW DETAILS BUTTON */}
      <Link to={`/items/${id}`} style={{ width: '100%', display: 'block' }}>
        <Button 
          type="default" 
          block 
          icon={<ArrowRight size={14} />} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px',
            fontWeight: 700,
            fontFamily: monoFont,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderRadius: 0,
            backgroundColor: paper,
            border: `1.5px solid ${ink}`,
            color: ink,
            height: '36px',
            boxShadow: `2px 2px 0px ${brass}`
          }}
        >
          View Record Details
        </Button>
      </Link>
    </Card>
  );
};

export default ItemCard;