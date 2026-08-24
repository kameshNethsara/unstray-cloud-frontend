import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Input, 
  Select, 
  Segmented, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Skeleton,
  Breadcrumb
} from 'antd';
import { Search, MapPin, ArrowUpDown, Filter, RotateCcw, Tag as TagIcon } from 'lucide-react';
import { itemService } from '../../services/itemService';
import { ITEM_CATEGORIES } from '../../types/item';
import type { Item, ItemType, ItemStatus } from '../../types/item';
import ItemCard from '../../components/items/ItemCard';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const { Title, Paragraph, Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper (skeletons, wells)
// const claimRed = "#A23E2E";  // LOST tag / alert highlight
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
          location: locationParam,
        });

        // Optional frontend filtering for search keywords
        let filteredData = data;
        if (searchParam) {
          const query = searchParam.toLowerCase();
          filteredData = data.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query)
          );
        }

        // Apply sorting (newest/oldest)
        filteredData.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return sortParam === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        setItems(filteredData);
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

  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: paper, 
        backgroundImage: paperTexture, 
        padding: '48px 24px 80px 24px', 
        fontFamily: bodyFont 
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* BREADCRUMB */}
        <Breadcrumb 
          style={{ marginBottom: '16px', fontFamily: monoFont, fontSize: '12px' }}
          items={[
            { title: <Link to="/" style={{ color: inkSoft }}>Home</Link> },
            { title: <span style={{ color: ink }}>Browse Directory</span> }
          ]}
        />

        {/* HEADER SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: monoFont,
              fontSize: '12px',
              letterSpacing: '1.5px',
              color: inkSoft,
              textTransform: 'uppercase',
              marginBottom: '10px',
              paddingBottom: '4px',
              borderBottom: `1px dashed ${inkSoft}`,
            }}
          >
            <TagIcon size={13} />
            Unstray Registry — Public Directory Search
          </div>
          <Title 
            level={2} 
            style={{ 
              margin: 0, 
              fontWeight: 700, 
              color: ink, 
              fontFamily: displayFont, 
              textTransform: 'uppercase', 
              letterSpacing: '-0.5px', 
              fontSize: '32px' 
            }}
          >
            Lost &amp; Found Directory
          </Title>
          <Paragraph style={{ color: inkSoft, margin: '6px 0 0 0', fontSize: '15px', fontFamily: bodyFont }}>
            Browse reports, search locations, and filter categories to locate matching items on file.
          </Paragraph>
        </div>

        {/* FILTER PANEL CARD */}
        <Card 
          style={{ 
            marginBottom: '32px', 
            borderRadius: 0, 
            boxShadow: `6px 6px 0px ${ink}`,
            border: `2px solid ${ink}`,
            backgroundColor: paperLight,
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Row gutter={[16, 16]} align="middle">
            
            {/* SEARCH KEYWORDS */}
            <Col xs={24} md={8}>
              <Input
                placeholder="Search keyword (e.g. phone, wallet)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onPressEnter={handleInputsSubmit}
                prefix={<Search size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                size="large"
                style={{
                  backgroundColor: paper,
                  border: `1.5px solid ${ink}`,
                  borderRadius: 0,
                  fontFamily: bodyFont,
                  color: ink,
                }}
              />
            </Col>

            {/* LOCATION KEYWORDS */}
            <Col xs={24} md={6}>
              <Input
                placeholder="Location (e.g. Library)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onPressEnter={handleInputsSubmit}
                prefix={<MapPin size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                size="large"
                style={{
                  backgroundColor: paper,
                  border: `1.5px solid ${ink}`,
                  borderRadius: 0,
                  fontFamily: bodyFont,
                  color: ink,
                }}
              />
            </Col>

            {/* SUBMIT INPUTS */}
            <Col xs={24} sm={12} md={5}>
              <Button 
                type="primary" 
                block 
                size="large" 
                onClick={handleInputsSubmit} 
                icon={<Filter size={16} />}
                style={{
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  height: '40px',
                  backgroundColor: ink,
                  borderColor: ink,
                  color: paperLight,
                  borderRadius: 0,
                  boxShadow: `2px 2px 0px ${brass}`,
                }}
              >
                Apply Search
              </Button>
            </Col>

            {/* RESET BUTTON */}
            <Col xs={24} sm={12} md={5}>
              <Button 
                block 
                size="large" 
                onClick={handleResetFilters} 
                icon={<RotateCcw size={16} />}
                style={{
                  fontFamily: monoFont,
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  height: '40px',
                  backgroundColor: paper,
                  borderColor: ink,
                  color: ink,
                  borderRadius: 0,
                }}
              >
                Reset All
              </Button>
            </Col>
          </Row>

          <div style={{ height: '1px', borderBottom: `1px dashed ${paperDeep}`, margin: '20px 0' }} />

          {/* SELECT FILTERS ROW */}
          <Row gutter={[16, 16]} align="middle">
            
            {/* TYPE FILTER: ALL / LOST / FOUND */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text style={{ fontSize: '11px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Item Type
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
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: monoFont,
                    fontSize: '12px',
                  }}
                />
              </Space>
            </Col>

            {/* CATEGORIES FILTER */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text style={{ fontSize: '11px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Category
                </Text>
                <Select
                  value={categoryParam || 'All'}
                  onChange={(val) => updateFilter('category', val === 'All' ? '' : val)}
                  size="large"
                  style={{ width: '100%' }}
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
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text style={{ fontSize: '11px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Listing Status
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
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: monoFont,
                    fontSize: '12px',
                  }}
                />
              </Space>
            </Col>

            {/* SORT FILTER */}
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text style={{ fontSize: '11px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Sort Order
                </Text>
                <Select
                  value={sortParam}
                  onChange={(val) => updateFilter('sort', val)}
                  size="large"
                  style={{ width: '100%' }}
                  suffixIcon={<ArrowUpDown size={15} style={{ color: ink }} />}
                >
                  <Select.Option value="newest">Newest First</Select.Option>
                  <Select.Option value="oldest">Oldest First</Select.Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* ITEMS LIST AREA */}
        {isLoading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Col key={n} xs={24} sm={12} lg={8}>
                <div style={{ backgroundColor: paperDeep, padding: '16px', border: `1px solid ${paperDeep}` }}>
                  <Skeleton.Image style={{ width: '100%', height: '180px', marginBottom: '16px' }} active />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </Col>
            ))}
          </Row>
        ) : hasError ? (
          <ErrorState message="Could not retrieve items from the directory." />
        ) : items.length === 0 ? (
          <EmptyState 
            message="No items match your active filters. Try broadening your keywords." 
          />
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Text style={{ fontSize: '13px', fontWeight: 600, fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Showing {items.length} {items.length === 1 ? 'file record' : 'file records'}
              </Text>
            </div>
            
            <Row gutter={[24, 28]}>
              {items.map((item) => (
                <Col key={item.id} xs={24} sm={12} lg={8}>
                  <ItemCard item={item} />
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