import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  Table, 
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
  FolderLock
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
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag accent
const claimGreen = "#3E6C52"; // FOUND tag accent
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
      // Fetch only items belonging to current user
      const data = await itemService.getItems({ userId: currentUser.id });
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

  // Apply tab filtering locally to avoid double round-trips
  useEffect(() => {
    let items = [...allItems];
    if (activeTab === 'lost') {
      items = items.filter((i) => i.type === 'LOST');
    } else if (activeTab === 'found') {
      items = items.filter((i) => i.type === 'FOUND');
    } else if (activeTab === 'resolved') {
      items = items.filter((i) => i.status === 'RESOLVED');
    }
    setFilteredItems(items);
  }, [allItems, activeTab]);

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
      message.success('Listing expunged from ledger.');
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
      const updated = await itemService.updateItem(selectedItemId, { status: newStatus });
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

  // Ant Design Table Columns for Desktop (Vintage Claim Ledger styling)
  const tableColumns = [
    {
      title: 'FILE NO. / ITEM',
      key: 'item',
      render: (_: any, record: Item) => {
        const itemImage = record.media && record.media.length > 0 
          ? record.media[0] 
          : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100&auto=format&fit=crop&q=80';
        return (
          <Space size="middle">
            <img 
              src={itemImage} 
              alt={record.title} 
              style={{ width: '46px', height: '46px', objectFit: 'cover', border: `1px solid ${ink}` }} 
            />
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft }}>
                NO. {String(record.id).padStart(5, '0').slice(-5)}
              </div>
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: '16px', color: ink }}>{record.title}</div>
              <Text style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase' }}>{record.category}</Text>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'LOCATION',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: bodyFont, fontSize: '13px', color: ink }}>
          <MapPin size={13} style={{ color: claimRed }} /> {loc}
        </span>
      )
    },
    {
      title: 'CLAIM TYPE',
      dataIndex: 'type',
      key: 'type',
      render: (type: ItemType) => (
        <div
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            border: `1px solid ${type === 'LOST' ? claimRed : claimGreen}`,
            color: type === 'LOST' ? claimRed : claimGreen,
            fontFamily: monoFont,
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {type}
        </div>
      )
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: ItemStatus) => (
        <div
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            border: `1px solid ${status === 'OPEN' ? ink : inkSoft}`,
            backgroundColor: status === 'OPEN' ? paperDeep : 'transparent',
            color: status === 'OPEN' ? ink : inkSoft,
            fontFamily: monoFont,
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {status}
        </div>
      )
    },
    {
      title: 'LOGGED DATE',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ fontFamily: monoFont, fontSize: '12px', color: inkSoft }}>
          {dayjs(date).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Space size="small">
          <Tooltip title="View case file">
            <Link to={`/items/${record.id}`}>
              <Button type="text" style={{ color: ink }} icon={<Eye size={16} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Amend details">
            <Link to={`/items/${record.id}/edit`}>
              <Button type="text" style={{ color: ink }} icon={<Edit size={16} />} />
            </Link>
          </Tooltip>
          <Tooltip title={record.status === 'OPEN' ? 'Mark Resolved' : 'Reopen Case'}>
            <Button 
              type="text" 
              icon={record.status === 'OPEN' ? <CheckCircle2 size={16} style={{ color: claimGreen }} /> : <XCircle size={16} style={{ color: ink }} />} 
              onClick={() => handleResolveTrigger(record.id)}
            />
          </Tooltip>
          <Tooltip title="Expunge listing permanently">
            <Button 
              type="text" 
              danger 
              icon={<Trash2 size={16} style={{ color: claimRed }} />} 
              onClick={() => handleDeleteTrigger(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Mobile claim card renderer
  const renderMobileCards = () => (
    <Row gutter={[16, 20]}>
      {filteredItems.map((item) => (
        <Col key={item.id} xs={24} sm={12}>
          <div 
            style={{ 
              position: 'relative',
              backgroundColor: paperLight,
              border: `2px solid ${ink}`,
              boxShadow: `4px 4px 0px ${ink}`,
              padding: '12px'
            }}
          >
            <ItemCard item={item} />
            <div 
              style={{ 
                marginTop: '12px', 
                paddingTop: '10px', 
                borderTop: `1px dashed ${paperDeep}`,
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: '8px' 
              }}
            >
              <Link to={`/items/${item.id}/edit`}>
                <button 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontFamily: monoFont,
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: ink,
                    border: `1px solid ${ink}`,
                    cursor: 'pointer'
                  }}
                >
                  <Edit size={12} /> Edit
                </button>
              </Link>
              <button 
                onClick={() => handleDeleteTrigger(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontFamily: monoFont,
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  color: claimRed,
                  border: `1px solid ${claimRed}`,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );

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
        
        {/* HEADER SECTION */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            flexWrap: 'wrap', 
            gap: '16px', 
            borderBottom: `2px solid ${ink}`,
            paddingBottom: '20px',
            marginBottom: '28px' 
          }}
        >
          <div>
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
              <FolderLock size={14} style={{ color: brass }} />
              Filer Personal Registry Ledger
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
              My Reported Cases
            </Title>
            <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, margin: '6px 0 0 0', fontSize: '15px' }}>
              Manage personal claim tickets, amend listing descriptors, or mark returned items as resolved.
            </Paragraph>
          </div>
          
          <Link to="/report/lost">
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '12px 20px',
                backgroundColor: ink,
                color: paperLight,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `3px 3px 0px ${brass}`
              }}
            >
              <PlusCircle size={15} /> File New Claim
            </button>
          </Link>
        </div>

        {/* FILTER TABS */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          style={{ marginBottom: '28px', fontFamily: monoFont }}
          items={[
            { label: 'ALL FILED RECORDS', key: 'all' },
            { label: 'MY LOST ITEMS', key: 'lost' },
            { label: 'MY FOUND ITEMS', key: 'found' },
            { label: 'RESOLVED / CLOSED', key: 'resolved' },
          ]}
        />

        {/* RENDER LISTS */}
        {isLoading ? (
          <LoadingState message="Retrieving your case files..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchUserItems} />
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            message={`No registered records found under this section tab.`} 
            actionText="File a Lost Report" 
            onAction={() => navigate('/report/lost')} 
          />
        ) : (
          /* RESPONSIVE LAYOUT TOGGLER (TABLE VS CARDS) */
          screens.xs || screens.sm ? (
            renderMobileCards()
          ) : (
            <div 
              style={{ 
                backgroundColor: paperLight, 
                border: `2px solid ${ink}`, 
                boxShadow: `6px 6px 0px ${ink}`,
                overflow: 'hidden'
              }}
            >
              <Table 
                dataSource={filteredItems.map(item => ({ ...item, key: item.id }))} 
                columns={tableColumns} 
                pagination={{ pageSize: 8 }}
                style={{ fontFamily: bodyFont }}
              />
            </div>
          )
        )}

        {/* CONFIRM DELETE MODAL */}
        <ConfirmDialog
          open={isDeleteOpen}
          title="Expunge Listing Permanently?"
          content="Are you sure you want to permanently delete this record from Unstray? Other community filers will no longer be able to match against this case entry."
          okText="Expunge Record"
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
          content="Toggle this case between OPEN and RESOLVED status. Reopened records resume active matching; resolved entries are closed in the archive."
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