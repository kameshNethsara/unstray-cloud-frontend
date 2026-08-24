import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  Table, 
  Tag as AntTag, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Grid, 
  Tooltip, 
  message 
} from 'antd';
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  MapPin,
  XCircle,
  PlusCircle,
  Tag as TagIcon
} from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { itemService } from '../../services/itemService';
import type { Item, ItemStatus, ItemType } from '../../types/item';
import ItemCard from '../../components/items/ItemCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
// const paperDeep = "#E2D8C1"; // recessed paper (skeletons, wells)
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const MyItems: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const screens = useBreakpoint();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<string>('all');

  // Deletion and status modal states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const fetchUserItems = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setHasError(false);
      // Fetch all items to allow filtering for both reported and claimed items
      const data = await itemService.getItems();
      setAllItems(data);
    } catch (err) {
      console.error('Failed to load user listings:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [currentUser]);

  // Apply tab filtering locally
  useEffect(() => {
    if (!currentUser) return;
    let items = [];
    if (activeTab === 'claims') {
      items = allItems.filter((i) => i.claims?.some(c => Number(c.claimerId) === Number(currentUser.id)));
    } else {
      // For all other tabs, only show items reported by the current user
      const userReportedItems = allItems.filter(i => Number(i.reportedBy) === Number(currentUser.id));
      if (activeTab === 'lost') {
        items = userReportedItems.filter((i) => i.type === 'LOST');
      } else if (activeTab === 'found') {
        items = userReportedItems.filter((i) => i.type === 'FOUND');
      } else if (activeTab === 'resolved') {
        items = userReportedItems.filter((i) => i.status === 'RESOLVED');
      } else {
        items = userReportedItems;
      }
    }
    setFilteredItems(items);
  }, [allItems, activeTab, currentUser]);

  const handleDeleteTrigger = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteOpen(true);
  };

  const handleResolveTrigger = (id: string) => {
    setSelectedItemId(id);
    setIsResolveOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItemId) return;
    setIsActionLoading(true);
    try {
      await itemService.deleteItem(selectedItemId);
      message.success('Listing deleted.');
      setAllItems((prev) => prev.filter((i) => i.id !== selectedItemId));
      setIsDeleteOpen(false);
    } catch (err) {
      message.error('Failed to delete listing.');
    } finally {
      setIsActionLoading(false);
      setSelectedItemId(null);
    }
  };

  const handleResolveConfirm = async () => {
    if (!selectedItemId) return;
    const targetItem = allItems.find((i) => i.id === selectedItemId);
    if (!targetItem) return;

    setIsActionLoading(true);
    const newStatus: ItemStatus = targetItem.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const updated = await itemService.updateItemStatus(selectedItemId, newStatus);
      message.success(`Status updated to ${newStatus}.`);
      setAllItems((prev) =>
        prev.map((item) => (item.id === selectedItemId ? updated : item))
      );
      setIsResolveOpen(false);
    } catch (err) {
      message.error('Failed to update listing status.');
    } finally {
      setIsActionLoading(false);
      setSelectedItemId(null);
    }
  };

  // Ant Design Table Columns for Desktop
  const tableColumns = [
    {
      title: 'Item',
      key: 'item',
      render: (_: any, record: Item) => {
        const itemImage = record.imageUrls && record.imageUrls.length > 0 
          ? record.imageUrls[0] 
          : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100&auto=format&fit=crop&q=80';
        return (
          <Space size="middle">
            <img 
              src={itemImage} 
              alt={record.title} 
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 0, border: `2px solid ${ink}` }} 
            />
            <div>
              <div style={{ fontWeight: 700, color: ink, fontFamily: displayFont, fontSize: '15px' }}>{record.title}</div>
              <Text style={{ fontSize: '12px', fontFamily: monoFont, color: inkSoft }}>{record.category}</Text>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontFamily: monoFont, color: ink }}>
          <MapPin size={13} style={{ color: brass }} /> {loc}
        </span>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: ItemType) => (
        <AntTag 
          style={{ 
            fontWeight: 700, 
            fontFamily: monoFont, 
            borderRadius: 0, 
            border: `1.5px solid ${type === 'LOST' ? claimRed : claimGreen}`,
            color: type === 'LOST' ? claimRed : claimGreen,
            backgroundColor: 'transparent'
          }}
        >
          {type}
        </AntTag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ItemStatus) => (
        <AntTag 
          style={{ 
            fontWeight: 700, 
            fontFamily: monoFont, 
            borderRadius: 0, 
            border: `1.5px solid ${status === 'OPEN' ? ink : inkSoft}`,
            color: status === 'OPEN' ? ink : inkSoft,
            backgroundColor: 'transparent'
          }}
        >
          {status}
        </AntTag>
      )
    },
    {
      title: activeTab === 'claims' ? 'My Claim Status' : 'Claims Verification',
      key: 'claims',
      render: (_: any, record: Item) => {
        if (activeTab === 'claims') {
          // Show the current user's claim status on this item
          const myClaim = record.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
          if (!myClaim) return <Text style={{ fontFamily: monoFont, color: inkSoft }}>-</Text>;
          return (
            <Space direction="vertical" size={2}>
              <AntTag 
                style={{ 
                  fontWeight: 700, 
                  fontFamily: monoFont, 
                  borderRadius: 0, 
                  border: `1.5px solid ${myClaim.status === 'APPROVED' ? claimGreen : myClaim.status === 'REJECTED' ? claimRed : brass}`,
                  color: myClaim.status === 'APPROVED' ? claimGreen : myClaim.status === 'REJECTED' ? claimRed : brass,
                  backgroundColor: 'transparent'
                }}
              >
                {myClaim.status}
              </AntTag>
              <Link to={`/items/${record.id}`}>
                <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px', fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>
                  View Details &rarr;
                </Button>
              </Link>
            </Space>
          );
        }

        if (record.type !== 'FOUND') return <Text style={{ fontFamily: monoFont, color: inkSoft }}>-</Text>;
        const claims = record.claims || [];
        const pendingCount = claims.filter(c => c.status === 'PENDING').length;
        
        if (claims.length === 0) return <Text style={{ fontFamily: monoFont, color: inkSoft }}>No claims yet</Text>;

        return (
          <Space direction="vertical" size={2}>
            <AntTag 
              style={{ 
                fontWeight: 700, 
                fontFamily: monoFont, 
                borderRadius: 0, 
                border: `1.5px solid ${pendingCount > 0 ? brass : claimGreen}`,
                color: pendingCount > 0 ? brass : claimGreen,
                backgroundColor: 'transparent'
              }}
            >
              {claims.length} Claim{claims.length !== 1 ? 's' : ''} ({pendingCount} pending)
            </AntTag>
            <Link to={`/items/${record.id}`}>
              <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px', fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>
                Manage Claims &rarr;
              </Button>
            </Link>
          </Space>
        );
      }
    },
    {
      title: 'Reported Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <span style={{ fontFamily: monoFont, fontSize: '13px', color: ink }}>{dayjs(date).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Space size="middle">
          <Tooltip title="View listing details page">
            <Link to={`/items/${record.id}`}>
              <Button type="text" shape="circle" icon={<Eye size={16} style={{ color: ink }} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Edit item attributes">
            <Link to={`/items/${record.id}/edit`}>
              <Button type="text" shape="circle" icon={<Edit size={16} style={{ color: ink }} />} />
            </Link>
          </Tooltip>
          <Tooltip title={record.status === 'OPEN' ? 'Mark as Resolved' : 'Reopen Listing'}>
            <Button 
              type="text" 
              shape="circle" 
              icon={record.status === 'OPEN' ? <CheckCircle2 size={16} style={{ color: claimGreen }} /> : <XCircle size={16} style={{ color: ink }} />} 
              onClick={() => handleResolveTrigger(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete listing permanently">
            <Button 
              type="text" 
              danger 
              shape="circle" 
              icon={<Trash2 size={16} style={{ color: claimRed }} />} 
              onClick={() => handleDeleteTrigger(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Mobile layout component
  const renderMobileCards = () => (
    <Row gutter={[16, 16]}>
      {filteredItems.map((item) => {
        const pendingClaimsCount = item.claims?.filter(c => c.status === 'PENDING').length || 0;
        return (
          <Col key={item.id} xs={24} sm={12}>
            <div 
              style={{ 
                position: 'relative',
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `4px 4px 0px ${ink}`,
              }}
            >
              <ItemCard item={item} />
              
              {/* Claims Badge for Mobile */}
              {activeTab === 'claims' ? (() => {
                const myClaim = item.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
                if (!myClaim) return null;
                return (
                  <div style={{ padding: '8px 12px', background: paper, borderTop: `1px dashed ${inkSoft}`, fontSize: '13px', fontFamily: monoFont }}>
                    <Text strong style={{ color: ink }}>Claim Status: </Text>
                    <AntTag 
                      style={{ 
                        fontWeight: 700, 
                        fontFamily: monoFont, 
                        borderRadius: 0, 
                        border: `1px solid ${myClaim.status === 'APPROVED' ? claimGreen : myClaim.status === 'REJECTED' ? claimRed : brass}`,
                        color: myClaim.status === 'APPROVED' ? claimGreen : myClaim.status === 'REJECTED' ? claimRed : brass,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {myClaim.status}
                    </AntTag>
                    <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: ink, textDecoration: 'underline' }}>
                      View Details &rarr;
                    </Link>
                  </div>
                );
              })() : (
                item.type === 'FOUND' && item.claims && item.claims.length > 0 && (
                  <div style={{ padding: '8px 12px', background: paper, borderTop: `1px dashed ${inkSoft}`, fontSize: '13px', fontFamily: monoFont }}>
                    <Text strong style={{ color: ink }}>{item.claims.length} Claim(s)</Text> {pendingClaimsCount > 0 && <AntTag style={{ marginLeft: '8px', borderRadius: 0, border: `1px solid ${brass}`, color: brass, backgroundColor: 'transparent', fontFamily: monoFont }}>{pendingClaimsCount} Pending</AntTag>}
                    <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: ink, textDecoration: 'underline' }}>
                      View &amp; Manage Claims &rarr;
                    </Link>
                  </div>
                )
              )}

              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '16px', 
                  right: '16px', 
                  zIndex: 10,
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <Link to={`/items/${item.id}/edit`}>
                  <Button 
                    size="small" 
                    icon={<Edit size={12} />} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontFamily: monoFont, 
                      fontSize: '11px', 
                      textTransform: 'uppercase', 
                      borderRadius: 0, 
                      backgroundColor: paper, 
                      border: `1.5px solid ${ink}`, 
                      color: ink 
                    }}
                  >
                    Edit
                  </Button>
                </Link>
                <Button 
                  danger 
                  size="small" 
                  icon={<Trash2 size={12} />} 
                  onClick={() => handleDeleteTrigger(item.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontFamily: monoFont, 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    borderRadius: 0, 
                    backgroundColor: 'transparent', 
                    border: `1.5px solid ${claimRed}`, 
                    color: claimRed 
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );

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
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
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
              Unstray Registry — Personal Filings
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
              My Reported Items
            </Title>
            <Paragraph style={{ color: inkSoft, margin: '6px 0 0 0', fontSize: '15px', fontFamily: bodyFont }}>
              Manage listings you have reported, update case statuses, or delete active posts from the registry desk.
            </Paragraph>
          </div>
          <Space wrap size="middle">
            <Link to="/report/lost">
              <Button 
                type="primary" 
                icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />}
                style={{
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  height: '42px',
                  padding: '0 20px',
                  backgroundColor: 'transparent',
                  borderColor: claimRed,
                  color: claimRed,
                  borderRadius: 0,
                  border: `2px solid ${claimRed}`,
                  transform: 'rotate(-1deg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Report Lost Item
              </Button>
            </Link>
            <Link to="/report/found">
              <Button 
                type="primary" 
                icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />} 
                style={{ 
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  height: '42px',
                  padding: '0 20px',
                  backgroundColor: 'transparent',
                  borderColor: claimGreen,
                  color: claimGreen,
                  borderRadius: 0,
                  border: `2px solid ${claimGreen}`,
                  transform: 'rotate(1deg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Report Found Item
              </Button>
            </Link>
          </Space>
        </div>

        {/* FILTER TABS */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          style={{ marginBottom: '24px', fontFamily: monoFont }}
          items={[
            { label: 'My Reported Items', key: 'all' },
            { label: 'My Lost Items', key: 'lost' },
            { label: 'My Found Items', key: 'found' },
            { label: 'Resolved', key: 'resolved' },
            { label: 'My Claims', key: 'claims' },
          ]}
        />

        {/* RENDER LISTS */}
        {isLoading ? (
          <LoadingState message="Loading your items list..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchUserItems} />
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            message={`No items found in this tab. Click below to create a listing.`} 
            actionText="Report Lost Item" 
            onAction={() => navigate('/report/lost')} 
          />
        ) : (
          /* RESPONSIVE LAYOUT TOGGLER (TABLE VS CARDS) */
          screens.xs || screens.sm ? (
            renderMobileCards()
          ) : (
            <div
              style={{
                border: `2px solid ${ink}`,
                boxShadow: `6px 6px 0px ${ink}`,
                backgroundColor: paperLight,
                overflow: 'hidden',
              }}
            >
              <Table 
                dataSource={filteredItems.map(item => ({ ...item, key: item.id }))} 
                columns={tableColumns} 
                pagination={{ pageSize: 8 }}
                style={{ 
                  backgroundColor: paperLight,
                  fontFamily: bodyFont,
                }}
              />
            </div>
          )
        )}

        {/* CONFIRM DELETE MODAL */}
        <ConfirmDialog
          open={isDeleteOpen}
          title="Delete Listing permanently?"
          content="Are you sure you want to delete this listing from Unstray? Other users will no longer be able to search or match against this item description."
          okText="Delete Listing"
          danger
          confirmLoading={isActionLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteOpen(false);
            setSelectedItemId(null);
          }}
        />

        {/* CONFIRM RESOLVE STATUS MODAL */}
        <ConfirmDialog
          open={isResolveOpen}
          title="Update Listing Status?"
          content="Would you like to toggle the status of this item listing between OPEN and RESOLVED? Reopened items appear in public queries; resolved items are archived."
          okText="Update Status"
          confirmLoading={isActionLoading}
          onConfirm={handleResolveConfirm}
          onCancel={() => {
            setIsResolveOpen(false);
            setSelectedItemId(null);
          }}
        />
        
      </div>
    </div>
  );
};

export default MyItems;