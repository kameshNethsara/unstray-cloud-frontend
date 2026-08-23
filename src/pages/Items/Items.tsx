import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Input, 
  Select, 
  Segmented, 
  // Button, 
  Space, 
  Typography, 
  Skeleton,
  Breadcrumb
} from 'antd';
import { Search, MapPin, ArrowUpDown, Filter, RotateCcw, FolderSearch } from 'lucide-react';
import { itemService } from '../../services/itemService';
import { ITEM_CATEGORIES } from '../../types/item';
import type { Item, ItemType, ItemStatus } from '../../types/item';
import ItemCard from '../../components/items/ItemCard';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const { Title, Paragraph, Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const Items: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Extract parameters from URL query params
  const typeParam = (searchParams.get('type') as ItemType | '') || '';
  const categoryParam = searchParams.get('category') || '';
  const statusParam = (searchParams.get('status') as ItemStatus | '') || '';
  const searchParam = searchParams.get('search') || '';
  const locationParam = searchParams.get('location') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  // Local state mirror for input fields to allow typing before submitting
  const [searchInput, setSearchInput] = useState(searchParam);
  const [locationInput, setLocationInput] = useState(locationParam);

  // Sync input values when query params change
  useEffect(() => {
    setSearchInput(searchParam);
    setLocationInput(locationParam);
  }, [searchParam, locationParam]);

  // Fetch items based on URL search params
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItems({
          type: typeParam,
          category: categoryParam,
          status: statusParam,
          search: searchParam,
          location: locationParam,
          sort: sortParam,
        });
        setItems(data);
      } catch (err) {
        console.error('Failed to retrieve items directory:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [typeParam, categoryParam, statusParam, searchParam, locationParam, sortParam]);

  // Helper to update individual query params
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Trigger search on inputs submit
  const handleInputsSubmit = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    if (locationInput.trim()) {
      newParams.set('location', locationInput.trim());
    } else {
      newParams.delete('location');
    }
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setSearchParams(new URLSearchParams());
  };

  // Alternate tag colors & angles for claim-ticket layout
  const ticketTint = (i: number) => (i % 2 === 0 ? claimRed : claimGreen);
  const ticketTilt = (i: number) => ["-1.2deg", "0.8deg", "-0.6deg", "1.1deg"][i % 4];

  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: paper, 
        backgroundImage: paperTexture,
        padding: '36px 24px 88px 24px', 
        fontFamily: bodyFont 
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* BREADCRUMB */}
        <Breadcrumb 
          style={{ 
            fontFamily: monoFont, 
            fontSize: '12px', 
            letterSpacing: '0.5px', 
            textTransform: 'uppercase',
            marginBottom: '20px' 
          }}
          items={[
            { title: <Link to="/" style={{ color: inkSoft }}>Home</Link> },
            { title: <span style={{ color: ink, fontWeight: 700 }}>Registry Directory</span> }
          ]}
        />

        {/* HEADER BLOCK */}
        <div 
          style={{ 
            borderBottom: `2px solid ${ink}`, 
            paddingBottom: '20px', 
            marginBottom: '28px' 
          }}
        >
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontFamily: monoFont, 
              fontSize: '11px', 
              letterSpacing: '1.5px', 
              color: inkSoft, 
              textTransform: 'uppercase',
              marginBottom: '6px' 
            }}
          >
            <FolderSearch size={14} style={{ color: brass }} />
            Official Registry Search Desk
          </div>
          <Title 
            level={2} 
            style={{ 
              fontFamily: displayFont, 
              fontSize: '38px',
              fontWeight: 700, 
              color: ink,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px'
            }}
          >
            Directory Ledger
          </Title>
          <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, margin: '6px 0 0 0', fontSize: '15px' }}>
            Filter logged cases, search neighborhood boundaries, and inspect registered claim tickets.
          </Paragraph>
        </div>

        {/* FILTER PANEL GRID — Claim Desk Control Terminal */}
        <div 
          style={{ 
            backgroundColor: paperLight, 
            border: `2px solid ${ink}`, 
            boxShadow: `6px 6px 0px ${ink}`,
            padding: '24px',
            marginBottom: '36px',
            position: 'relative'
          }}
        >
          {/* Brass Grommet */}
          <div 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: `2px solid ${brass}`,
              backgroundColor: paper
            }}
          />

          <Row gutter={[16, 16]} align="middle">
            
            {/* SEARCH KEYWORDS */}
            <Col xs={24} md={8}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  Keyword Description
                </Text>
                <Input
                  placeholder="e.g. phone, wallet, keys..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onPressEnter={handleInputsSubmit}
                  prefix={<Search size={16} style={{ color: ink, marginRight: '6px' }} />}
                  style={{
                    fontFamily: monoFont,
                    fontSize: '13px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '42px',
                    backgroundColor: paper
                  }}
                />
              </Space>
            </Col>

            {/* LOCATION KEYWORDS */}
            <Col xs={24} md={6}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  Location / Sector
                </Text>
                <Input
                  placeholder="e.g. Library, Main Hall..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onPressEnter={handleInputsSubmit}
                  prefix={<MapPin size={16} style={{ color: claimRed, marginRight: '6px' }} />}
                  style={{
                    fontFamily: monoFont,
                    fontSize: '13px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '42px',
                    backgroundColor: paper
                  }}
                />
              </Space>
            </Col>

            {/* SUBMIT INPUTS BUTTON */}
            <Col xs={24} sm={12} md={5}>
              <div style={{ paddingTop: '18px' }}>
                <button
                  onClick={handleInputsSubmit}
                  style={{
                    width: '100%',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: monoFont,
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    backgroundColor: ink,
                    color: paperLight,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Filter size={15} /> Apply Query
                </button>
              </div>
            </Col>

            {/* RESET BUTTON */}
            <Col xs={24} sm={12} md={5}>
              <div style={{ paddingTop: '18px' }}>
                <button
                  onClick={handleResetFilters}
                  style={{
                    width: '100%',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: monoFont,
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    backgroundColor: 'transparent',
                    color: ink,
                    border: `1px solid ${ink}`,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={15} /> Reset Filters
                </button>
              </div>
            </Col>
          </Row>

          <div style={{ height: '1px', borderBottom: `1px dashed ${paperDeep}`, margin: '20px 0' }} />

          {/* SELECT FILTERS ROW */}
          <Row gutter={[16, 16]} align="middle">
            
            {/* TYPE FILTER: ALL / LOST / FOUND */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  Claim Type
                </Text>
                <Segmented
                  value={typeParam || 'ALL'}
                  onChange={(val) => updateFilter('type', val === 'ALL' ? '' : val.toString())}
                  options={[
                    { label: 'All', value: 'ALL' },
                    { label: 'Lost', value: 'LOST' },
                    { label: 'Found', value: 'FOUND' },
                  ]}
                  block
                  style={{
                    fontFamily: monoFont,
                    backgroundColor: paperDeep,
                    border: `1px solid ${ink}`,
                    borderRadius: 0,
                    padding: '2px'
                  }}
                />
              </Space>
            </Col>

            {/* CATEGORIES FILTER */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  Item Category
                </Text>
                <Select
                  value={categoryParam || 'All'}
                  onChange={(val) => updateFilter('category', val === 'All' ? '' : val)}
                  style={{ width: '100%', fontFamily: monoFont, borderRadius: 0 }}
                  size="large"
                >
                  <Select.Option value="All">All Categories</Select.Option>
                  {ITEM_CATEGORIES.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
            </Col>

            {/* STATUS FILTER */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  File Status
                </Text>
                <Segmented
                  value={statusParam || 'ALL'}
                  onChange={(val) => updateFilter('status', val === 'ALL' ? '' : val.toString())}
                  options={[
                    { label: 'All', value: 'ALL' },
                    { label: 'Open', value: 'OPEN' },
                    { label: 'Resolved', value: 'RESOLVED' },
                  ]}
                  block
                  style={{
                    fontFamily: monoFont,
                    backgroundColor: paperDeep,
                    border: `1px solid ${ink}`,
                    borderRadius: 0,
                    padding: '2px'
                  }}
                />
              </Space>
            </Col>

            {/* SORT FILTER */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Text style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                  Sorting Order
                </Text>
                <Select
                  value={sortParam}
                  onChange={(val) => updateFilter('sort', val)}
                  style={{ width: '100%', fontFamily: monoFont, borderRadius: 0 }}
                  size="large"
                  suffixIcon={<ArrowUpDown size={14} style={{ color: ink }} />}
                >
                  <Select.Option value="newest">Newest First</Select.Option>
                  <Select.Option value="oldest">Oldest First</Select.Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </div>

        {/* ITEMS LIST AREA */}
        {isLoading ? (
          <Row gutter={[28, 36]}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Col key={n} xs={24} sm={12} lg={8}>
                <div style={{ backgroundColor: paperDeep, padding: '16px', border: `1px solid ${paperDeep}` }}>
                  <Skeleton.Image style={{ width: '100%', height: '180px' }} active />
                  <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: '12px' }} />
                </div>
              </Col>
            ))}
          </Row>
        ) : hasError ? (
          <ErrorState onRetry={() => navigate(0)} />
        ) : items.length === 0 ? (
          <EmptyState 
            message="No records on file matching your search query. Try broadening your keywords." 
            actionText="Reset Directory Filters" 
            onAction={handleResetFilters} 
          />
        ) : (
          <div>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px',
                borderBottom: `1px solid ${ink}`,
                paddingBottom: '8px'
              }}
            >
              <Text style={{ fontFamily: monoFont, fontSize: '12px', fontWeight: 700, color: inkSoft, textTransform: 'uppercase', letterSpacing: '1px' }}>
                MATCHING FILES FOUND: {items.length}
              </Text>
            </div>
            
            <Row gutter={[28, 40]}>
              {items.map((item, i) => (
                <Col key={item.id} xs={24} sm={12} lg={8}>
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: paperLight,
                      border: `1px solid ${ink}`,
                      borderLeft: `6px solid ${ticketTint(i)}`,
                      transform: `rotate(${ticketTilt(i)})`,
                      transition: 'transform 0.2s ease',
                      boxShadow: `3px 3px 0px ${ink}`
                    }}
                  >
                    {/* Grommet Accent */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '12px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: `2px solid ${brass}`,
                        backgroundColor: paper,
                        zIndex: 2
                      }}
                    />
                    <div
                      style={{
                        fontFamily: monoFont,
                        fontSize: '11px',
                        color: inkSoft,
                        padding: '8px 14px 6px 14px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      NO. {String(item.id).padStart(5, '0').slice(-5)}
                    </div>
                    <div style={{ borderTop: `1px dashed ${paperDeep}`, padding: '12px' }}>
                      <ItemCard item={item} />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Items;