import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Tag as AntTag, 
  Button, 
  Typography, 
  Space, 
  Card, 
  Carousel, 
  // Divider, 
  Descriptions, 
  Modal, 
  message,
  Breadcrumb,
  Alert,
  Form,
  Input,
  Table
} from 'antd';
import { 
  MapPin, 
  Calendar, 
  Tag as CategoryIcon, 
  Mail, 
  Phone, 
  User, 
  ChevronLeft,
  Edit,
  Trash2,
  CheckCircle,
  Flag,
  Share2
} from 'lucide-react';
import dayjs from 'dayjs';
import { itemService } from '../../services/itemService';
import type { Item, ItemStatus } from '../../types/item';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

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
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Modals / Dialogs states
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState<boolean>(false);

  const [claimForm] = Form.useForm();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error('Failed to load item detail details:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Fetching item file..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <ErrorState 
          title="Item Record Not Found"
          message="The item listing you are looking for may have been deleted, resolved, or is temporarily unavailable in the registry."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Permission Check
  const isOwner = currentUser && Number(item.reportedBy) === Number(currentUser.id);
  const isLost = item.type === 'LOST';
  const isOpen = item.status === 'OPEN';

  // Check if current user has already claimed this item
  const myClaims = item.claims?.filter(c => Number(c.claimerId) === Number(currentUser?.id)) || [];
  const hasClaimed = myClaims.length > 0;

  const handleDeleteConfirm = async () => {
    setIsSubmittingAction(true);
    try {
      await itemService.deleteItem(item.id);
      message.success('Item listing deleted successfully.');
      setIsDeleteOpen(false);
      navigate('/my-items');
    } catch (err) {
      message.error('Failed to delete item listing.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleResolveConfirm = async () => {
    setIsSubmittingAction(true);
    const newStatus: ItemStatus = item.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const updated = await itemService.updateItemStatus(item.id, newStatus);
      setItem(updated);
      message.success(`Listing status marked as ${newStatus}.`);
      setIsResolveOpen(false);
    } catch (err) {
      message.error('Failed to update listing status.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleClaimSubmit = async (values: { proofDescription: string; contactPhone: string; contactEmail: string }) => {
    if (!item || !currentUser) return;
    setIsSubmittingClaim(true);
    try {
      const updatedItem = await itemService.submitClaim(item.id, {
        claimerId: Number(currentUser.id),
        claimerName: currentUser.name || currentUser.name,
        proofDescription: values.proofDescription,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
      });
      setItem(updatedItem);
      message.success('Claim submitted successfully! The owner will review your proof.');
      setIsClaimModalOpen(false);
      claimForm.resetFields();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to submit claim.');
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const handleResolveClaim = async (claimId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!item) return;
    try {
      const updatedItem = await itemService.resolveClaim(item.id, claimId, status);
      setItem(updatedItem);
      message.success(`Claim successfully ${status.toLowerCase()}ed.`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || `Failed to ${status.toLowerCase()} claim.`);
    }
  };

  const handleReportListing = () => {
    message.info('Thank you. A moderator has been notified about this listing.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copied to clipboard!');
  };

  // Image assets gallery logic mapping imageUrls array
  const imageGallery = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls
    : ['https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop&q=80'];

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
        
        {/* BREADCRUMBS & BACK BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Breadcrumb style={{ fontFamily: monoFont, fontSize: '12px' }}>
            <Breadcrumb.Item><Link to="/" style={{ color: inkSoft }}>Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/items" style={{ color: inkSoft }}>Browse Directory</Link></Breadcrumb.Item>
            <Breadcrumb.Item><span style={{ color: ink }}>Case #{String(item.id).padStart(5, '0')}</span></Breadcrumb.Item>
          </Breadcrumb>
          <Button 
            type="text" 
            icon={<ChevronLeft size={16} />} 
            onClick={() => navigate(-1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontFamily: monoFont, 
              fontSize: '12px', 
              color: ink, 
              textTransform: 'uppercase' 
            }}
          >
            Back
          </Button>
        </div>

        <Row gutter={[32, 32]}>
          {/* LEFT PANEL: IMAGE GALLERIES */}
          <Col xs={24} md={12}>
            <Card 
              styles={{ body: { padding: '12px' } }}
              style={{ 
                borderRadius: 0, 
                boxShadow: `6px 6px 0px ${ink}`,
                border: `2px solid ${ink}`,
                backgroundColor: paperLight,
              }}
            >
              {imageGallery.length > 1 ? (
                <Carousel arrows infinite={false} style={{ background: paperDeep, border: `1.5px solid ${ink}`, overflow: 'hidden' }}>
                  {imageGallery.map((url, idx) => (
                    <div key={idx} style={{ height: '400px', width: '100%' }}>
                      <img 
                        src={url} 
                        alt={`${item.title} gallery ${idx + 1}`} 
                        style={{ width: '100%', height: '400px', objectFit: 'contain', backgroundColor: paperDeep }} 
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div style={{ height: '400px', width: '100%', border: `1.5px solid ${ink}`, overflow: 'hidden', backgroundColor: paperDeep }}>
                  <img 
                    src={imageGallery[0]} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}
            </Card>
          </Col>

          {/* RIGHT PANEL: INFO & ACTIONS */}
          <Col xs={24} md={12}>
            <Card 
              style={{ 
                borderRadius: 0, 
                boxShadow: `6px 6px 0px ${ink}`,
                border: `2px solid ${ink}`,
                backgroundColor: paperLight,
                height: '100%'
              }}
              styles={{ body: { padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }}
            >
              <div>
                {/* STATUS & TYPE BADGES */}
                <Space style={{ marginBottom: '16px' }} size="small">
                  <AntTag 
                    style={{ 
                      fontWeight: 700, 
                      fontFamily: monoFont, 
                      padding: '4px 12px', 
                      borderRadius: 0, 
                      fontSize: '12px', 
                      border: `1.5px solid ${isLost ? claimRed : claimGreen}`,
                      color: isLost ? claimRed : claimGreen,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {item.type}
                  </AntTag>
                  <AntTag 
                    style={{ 
                      fontWeight: 700, 
                      fontFamily: monoFont, 
                      padding: '4px 12px', 
                      borderRadius: 0, 
                      fontSize: '12px', 
                      border: `1.5px solid ${isOpen ? ink : inkSoft}`,
                      color: isOpen ? ink : inkSoft,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {item.status}
                  </AntTag>
                </Space>

                {/* TITLE */}
                <Title level={2} style={{ margin: '0 0 12px 0', fontWeight: 700, color: ink, fontFamily: displayFont, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                  {item.title}
                </Title>

                {/* CATEGORY & LOCATION */}
                <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontSize: '13px', fontFamily: monoFont }}>
                    <CategoryIcon size={15} style={{ color: brass }} />
                    <Text style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, color: inkSoft, fontFamily: monoFont }}>
                      {item.category}
                    </Text>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: ink, fontSize: '14px', fontFamily: monoFont }}>
                    <MapPin size={15} style={{ color: brass }} />
                    <Text strong style={{ fontFamily: monoFont, color: ink }}>{item.location}</Text>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontSize: '13px', fontFamily: monoFont }}>
                    <Calendar size={15} style={{ color: brass }} />
                    <Text style={{ color: inkSoft, fontFamily: monoFont }}>
                      Reported {dayjs(item.createdAt).format('MMMM DD, YYYY [at] h:mm A')}
                    </Text>
                  </div>
                </Space>

                <div style={{ height: '1px', borderBottom: `1px dashed ${paperDeep}`, margin: '20px 0' }} />

                {/* DESCRIPTION */}
                <Title level={5} style={{ color: ink, fontWeight: 700, fontFamily: displayFont, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Description
                </Title>
                <Paragraph style={{ color: inkSoft, fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '24px', fontFamily: bodyFont }}>
                  {item.description}
                </Paragraph>
                
                {/* CONTACT INFO */}
                <Card 
                  size="small" 
                  title={
                    <Text strong style={{ color: ink, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: displayFont, textTransform: 'uppercase', fontSize: '14px' }}>
                      <User size={15} style={{ color: brass }} /> Reporter Contact File
                    </Text>
                  } 
                  style={{ 
                    marginTop: '24px', 
                    borderRadius: 0, 
                    background: paper,
                    border: `1.5px solid ${ink}`,
                  }}
                >
                  {isAuthenticated ? (
                    <Descriptions column={1} size="small" style={{ marginTop: '8px' }}>
                      <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '12px', color: inkSoft, textTransform: 'uppercase' }}>Reporter Name</span>}>
                        <Text strong style={{ fontFamily: bodyFont, color: ink }}>{item.ownerName || `User #${item.reportedBy}`}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '12px', color: inkSoft, textTransform: 'uppercase' }}>Email</span>}>
                        {item.ownerEmail ? (
                          <a href={`mailto:${item.ownerEmail}?subject=Unstray - Regarding ${item.title}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{item.ownerEmail}</a>
                        ) : <Text style={{ fontFamily: bodyFont, color: inkSoft }}>Not Provided</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '12px', color: inkSoft, textTransform: 'uppercase' }}>Phone</span>}>
                        {item.ownerPhone ? (
                          <a href={`tel:${item.ownerPhone}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{item.ownerPhone}</a>
                        ) : <Text style={{ fontFamily: bodyFont, color: inkSoft }}>Not Provided</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <div style={{ padding: '8px 0' }}>
                      <Alert
                        message={
                          <span style={{ fontFamily: bodyFont, fontSize: '13px' }}>
                            Please <Link to="/login" state={{ from: { pathname: `/items/${item.id}` } }} style={{ fontFamily: monoFont, fontWeight: 600, color: claimRed, textDecoration: 'underline' }}>log in</Link> to view contact details so you can reach out directly.
                          </span>
                        }
                        type="warning"
                        showIcon
                        style={{ borderRadius: 0, backgroundColor: paperLight, border: `1px solid ${brass}` }}
                      />
                    </div>
                  )}
                </Card>

                {!isOpen && (
                  <Alert 
                    message={`This item listing is RESOLVED. It has been successfully returned or matched.`} 
                    type="success" 
                    showIcon 
                    style={{ marginTop: '24px', borderRadius: 0, backgroundColor: paper, border: `1.5px solid ${claimGreen}`, fontFamily: monoFont }}
                  />
                )}
              </div>

              <div style={{ marginTop: '32px' }}>
                {/* ACTION BUTTONS */}
                {isOwner ? (
                  /* OWNER CONTROLS */
                  <Card style={{ background: paper, border: `1.5px solid ${ink}`, borderRadius: 0 }} styles={{ body: { padding: '16px' } }}>
                    <Text style={{ display: 'block', marginBottom: '12px', fontWeight: 600, fontSize: '12px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase' }}>
                      You filed this report. Manage case status below:
                    </Text>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={8}>
                        <Button 
                          type="primary" 
                          block 
                          icon={<CheckCircle size={16} style={{ marginRight: '4px' }} />}
                          onClick={() => setIsResolveOpen(true)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: isOpen ? claimGreen : ink, 
                            borderColor: isOpen ? claimGreen : ink,
                            borderRadius: 0,
                            fontFamily: monoFont,
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                        >
                          {isOpen ? 'Mark Resolved' : 'Reopen Post'}
                        </Button>
                      </Col>
                      <Col xs={12} sm={8}>
                        <Link to={`/items/${item.id}/edit`}>
                          <Button 
                            type="default" 
                            block 
                            icon={<Edit size={16} style={{ marginRight: '4px' }} />}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              borderRadius: 0,
                              backgroundColor: paperLight,
                              border: `1.5px solid ${ink}`,
                              color: ink,
                              fontFamily: monoFont,
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}
                          >
                            Edit Details
                          </Button>
                        </Link>
                      </Col>
                      <Col xs={12} sm={8}>
                        <Button 
                          danger 
                          block 
                          icon={<Trash2 size={16} style={{ marginRight: '4px' }} />}
                          onClick={() => setIsDeleteOpen(true)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: 0,
                            border: `1.5px solid ${claimRed}`,
                            color: claimRed,
                            backgroundColor: 'transparent',
                            fontFamily: monoFont,
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ) : (
                  /* GUEST ACTIONS */
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      {isLost ? (
                        <Button 
                          type="primary" 
                          size="large" 
                          block 
                          disabled={!isOpen}
                          icon={<Mail size={18} style={{ marginRight: '6px' }} />}
                          onClick={() => {
                            if (isAuthenticated) {
                              setIsContactOpen(true);
                            } else {
                              message.warning('Please log in to contact the owner.');
                              navigate('/login', { state: { from: { pathname: `/items/${item.id}` } } });
                            }
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 700,
                            fontFamily: monoFont,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            height: '46px',
                            backgroundColor: ink,
                            borderColor: ink,
                            color: paperLight,
                            borderRadius: 0,
                            boxShadow: `3px 3px 0px ${brass}`
                          }}
                        >
                          Contact Owner
                        </Button>
                      ) : (
                        <Button 
                          type="primary" 
                          size="large" 
                          block 
                          disabled={!isOpen || hasClaimed}
                          icon={<CheckCircle size={18} style={{ marginRight: '6px' }} />}
                          onClick={() => {
                            if (isAuthenticated) {
                              setIsClaimModalOpen(true);
                            } else {
                              message.warning('Please log in to claim this item.');
                              navigate('/login', { state: { from: { pathname: `/items/${item.id}` } } });
                            }
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 700,
                            fontFamily: monoFont,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            height: '46px',
                            backgroundColor: (isOpen && !hasClaimed) ? claimGreen : inkSoft, 
                            borderColor: (isOpen && !hasClaimed) ? claimGreen : inkSoft,
                            color: paperLight,
                            borderRadius: 0,
                            boxShadow: `3px 3px 0px ${brass}`
                          }}
                        >
                          {hasClaimed ? 'Claim Submitted' : 'Claim Item'}
                        </Button>
                      )}
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button 
                        size="large" 
                        block 
                        icon={<Share2 size={16} />}
                        onClick={handleShare}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontFamily: monoFont,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          height: '46px',
                          backgroundColor: paper,
                          border: `2px solid ${ink}`,
                          color: ink,
                          borderRadius: 0
                        }}
                      >
                        Share
                      </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button 
                        type="text" 
                        danger 
                        size="large" 
                        block 
                        icon={<Flag size={16} />}
                        onClick={handleReportListing}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontFamily: monoFont,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          height: '46px',
                          color: claimRed
                        }}
                      >
                        Report
                      </Button>
                    </Col>
                  </Row>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* CONFIRM DELETE DIALOG */}
        <ConfirmDialog
          open={isDeleteOpen}
          title="Delete Listing?"
          content="Are you sure you want to delete this listing permanently? This action cannot be undone."
          okText="Yes, Delete"
          danger
          confirmLoading={isSubmittingAction}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
        />

        {/* CONFIRM RESOLVE DIALOG */}
        <ConfirmDialog
          open={isResolveOpen}
          title={isOpen ? 'Mark as Resolved?' : 'Reopen Listing?'}
          content={
            isOpen 
              ? 'Marking this item as resolved means you have successfully returned/located it. The listing will remain viewable but marked as completed.'
              : 'Would you like to reopen this listing for active match searches?'
          }
          okText={isOpen ? 'Resolve' : 'Reopen'}
          confirmLoading={isSubmittingAction}
          onConfirm={handleResolveConfirm}
          onCancel={() => setIsResolveOpen(false)}
        />

        {/* CONTACT OWNER MODAL */}
        <Modal
          open={isContactOpen}
          title={<span style={{ fontFamily: displayFont, color: ink, fontWeight: 700, fontSize: '20px', textTransform: 'uppercase' }}>Contact Owner Info</span>}
          onCancel={() => setIsContactOpen(false)}
          footer={[
            <Button 
              key="close" 
              onClick={() => setIsContactOpen(false)}
              style={{
                borderRadius: 0,
                backgroundColor: paper,
                border: `2px solid ${ink}`,
                color: ink,
                fontFamily: monoFont,
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
              }}
            >
              Close
            </Button>
          ]}
          destroyOnClose
          modalRender={(modal) => (
            <div
              style={{
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `8px 8px 0px ${ink}`,
                padding: '24px',
              }}
            >
              {modal}
            </div>
          )}
        >
          <div style={{ padding: '16px 0' }}>
            <Paragraph style={{ fontFamily: bodyFont, color: inkSoft }}>
              Get in touch with the listing creator to arrange a verified return.
            </Paragraph>
            <Descriptions column={1} bordered size="middle" style={{ marginTop: '16px', backgroundColor: paper, border: `1.5px solid ${ink}` }}>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}><User size={14} style={{ color: brass }} /> Name</span>}>
                <span style={{ fontFamily: bodyFont, fontWeight: 600, color: ink }}>{item.ownerName || 'Verified User'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}><Mail size={14} style={{ color: brass }} /> Email</span>}>
                {item.ownerEmail ? (
                  <a href={`mailto:${item.ownerEmail}?subject=Unstray - Regarding ${item.title}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{item.ownerEmail}</a>
                ) : <Text style={{ fontFamily: bodyFont, color: inkSoft }}>Not Provided</Text>}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}><Phone size={14} style={{ color: brass }} /> Phone</span>}>
                {item.ownerPhone ? (
                  <a href={`tel:${item.ownerPhone}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{item.ownerPhone}</a>
                ) : <Text style={{ fontFamily: bodyFont, color: inkSoft }}>Not Provided</Text>}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Modal>

        {/* SHOW NON-OWNER THEIR OWN SUBMITTED CLAIMS */}
        {!isOwner && hasClaimed && (
          <Card 
            title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: displayFont, textTransform: 'uppercase', color: ink }}><CheckCircle size={18} style={{ color: claimGreen }} /> Your Submitted Claim Status</span>}
            style={{ 
              marginTop: '32px', 
              borderRadius: 0, 
              boxShadow: `6px 6px 0px ${ink}`, 
              border: `2px solid ${ink}`,
              background: paperLight 
            }}
          >
            {myClaims.map(claim => (
              <Descriptions key={claim.claimId} column={{ xs: 1, sm: 2, md: 3 }} bordered size="small" style={{ marginBottom: '16px', background: paper, border: `1.5px solid ${ink}` }}>
                <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}>Status</span>}>
                  <AntTag 
                    style={{ 
                      fontWeight: 700, 
                      fontFamily: monoFont, 
                      borderRadius: 0, 
                      border: `1px solid ${claim.status === 'APPROVED' ? claimGreen : claim.status === 'REJECTED' ? claimRed : brass}`,
                      color: claim.status === 'APPROVED' ? claimGreen : claim.status === 'REJECTED' ? claimRed : brass,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {claim.status}
                  </AntTag>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}>Date Submitted</span>}>
                  <span style={{ fontFamily: monoFont }}>{dayjs(claim.createdAt).format('MMMM DD, YYYY')}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}>Your Contact Phone</span>}>
                  <span style={{ fontFamily: monoFont }}>{claim.contactPhone}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase' }}>Proof Provided</span>} span={3}>
                  <span style={{ fontFamily: bodyFont }}>{claim.proofDescription}</span>
                </Descriptions.Item>
              </Descriptions>
            ))}
          </Card>
        )}

        {/* SHOW OWNER ALL SUBMITTED CLAIMS TO MANAGE */}
        {isOwner && !isLost && (
          <Card 
            title={<span style={{ fontFamily: displayFont, textTransform: 'uppercase', color: ink, fontSize: '20px' }}>Submitted Claims &amp; Verification</span>} 
            style={{ 
              marginTop: '32px', 
              borderRadius: 0, 
              boxShadow: `6px 6px 0px ${ink}`, 
              border: `2px solid ${ink}`,
              backgroundColor: paperLight
            }}
          >
            <Table
              dataSource={item.claims || []}
              rowKey="claimId"
              scroll={{ x: 900 }}
              style={{ fontFamily: bodyFont }}
              columns={[
                {
                  title: 'Claimant Name & ID',
                  key: 'claimerName',
                  render: (_: any, record: any) => (
                    <div>
                      <Text strong style={{ fontFamily: displayFont, fontSize: '15px', color: ink }}>{record.claimerName || `User #${record.claimerId}`}</Text>
                      <div><Text style={{ fontSize: '12px', fontFamily: monoFont, color: inkSoft }}>ID: {record.claimerId}</Text></div>
                    </div>
                  )
                },
                {
                  title: 'Claimant Email',
                  dataIndex: 'claimerEmail',
                  key: 'claimerEmail',
                  render: (email: string) => email ? <a href={`mailto:${email}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{email}</a> : <Text style={{ fontFamily: monoFont, color: inkSoft }}>Not Provided</Text>
                },
                {
                  title: 'Proof Description',
                  dataIndex: 'proofDescription',
                  key: 'proofDescription',
                  render: (text: string) => (
                    <Paragraph style={{ margin: 0, minWidth: '200px', fontFamily: bodyFont }} ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                      {text}
                    </Paragraph>
                  )
                },
                {
                  title: 'Contact Phone',
                  dataIndex: 'contactPhone',
                  key: 'contactPhone',
                  render: (phone: string) => <a href={`tel:${phone}`} style={{ fontFamily: monoFont, color: ink, textDecoration: 'underline' }}>{phone}</a>
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    let borderColor = brass;
                    let color = brass;
                    if (status === 'APPROVED') { borderColor = claimGreen; color = claimGreen; }
                    if (status === 'REJECTED') { borderColor = claimRed; color = claimRed; }
                    return (
                      <AntTag 
                        style={{ 
                          fontWeight: 700, 
                          fontFamily: monoFont, 
                          borderRadius: 0, 
                          border: `1.5px solid ${borderColor}`,
                          color: color,
                          backgroundColor: 'transparent'
                        }}
                      >
                        {status}
                      </AntTag>
                    );
                  }
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  fixed: 'right',
                  render: (_, record) => {
                    if (record.status !== 'PENDING') {
                      return <Text style={{ fontFamily: monoFont, color: inkSoft }}>-</Text>;
                    }
                    return (
                      <Space>
                        <Button 
                          type="primary" 
                          size="small" 
                          style={{ 
                            backgroundColor: claimGreen, 
                            borderColor: claimGreen,
                            borderRadius: 0,
                            fontFamily: monoFont,
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                          onClick={() => handleResolveClaim(record.claimId, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button 
                          danger 
                          size="small" 
                          onClick={() => handleResolveClaim(record.claimId, 'REJECTED')}
                          style={{
                            borderRadius: 0,
                            border: `1.5px solid ${claimRed}`,
                            color: claimRed,
                            backgroundColor: 'transparent',
                            fontFamily: monoFont,
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                        >
                          Reject
                        </Button>
                      </Space>
                    );
                  }
                }
              ]}
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: 'No claims submitted yet.' }}
            />
          </Card>
        )}

        {/* CLAIM ITEM MODAL */}
        <Modal
          open={isClaimModalOpen}
          title={<span style={{ fontFamily: displayFont, color: ink, fontWeight: 700, fontSize: '20px', textTransform: 'uppercase' }}>Submit Claim &amp; Proof of Ownership</span>}
          onCancel={() => setIsClaimModalOpen(false)}
          footer={null}
          destroyOnClose
          modalRender={(modal) => (
            <div
              style={{
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `8px 8px 0px ${ink}`,
                padding: '24px',
              }}
            >
              {modal}
            </div>
          )}
        >
          <div style={{ padding: '8px 0' }}>
            <Paragraph style={{ fontFamily: bodyFont, color: inkSoft }}>
              Please provide proof description and your contact details to claim this item. The poster will review your claim.
            </Paragraph>
            <Form
              form={claimForm}
              layout="vertical"
              onFinish={handleClaimSubmit}
              initialValues={{ 
                contactPhone: currentUser?.phone || '',
                contactEmail: currentUser?.email || ''
              }}
            >
              <Form.Item
                name="proofDescription"
                label={
                  <span style={{ fontFamily: monoFont, fontSize: '12px', fontWeight: 600, color: ink, textTransform: 'uppercase' }}>
                    Proof of Ownership
                  </span>
                }
                rules={[{ required: true, message: 'Please describe the proof of ownership' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Provide specific details about the item that only the owner would know (e.g. serial numbers, unique characteristics, lock screen wallpaper, contents, etc.)"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="contactPhone"
                label={
                  <span style={{ fontFamily: monoFont, fontSize: '12px', fontWeight: 600, color: ink, textTransform: 'uppercase' }}>
                    Contact Phone Number
                  </span>
                }
                rules={[{ required: true, message: 'Please provide your contact phone number' }]}
              >
                <Input 
                  placeholder="e.g. +94 77 123 4567" 
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                label={
                  <span style={{ fontFamily: monoFont, fontSize: '12px', fontWeight: 600, color: ink, textTransform: 'uppercase' }}>
                    Contact Email Address
                  </span>
                }
                rules={[
                  { required: true, message: 'Please provide your contact email' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input 
                  placeholder="e.g. user@example.com" 
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button 
                    onClick={() => setIsClaimModalOpen(false)}
                    style={{
                      borderRadius: 0,
                      backgroundColor: paper,
                      border: `2px solid ${ink}`,
                      color: ink,
                      fontFamily: monoFont,
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={isSubmittingClaim} 
                    style={{ 
                      borderRadius: 0,
                      backgroundColor: claimGreen,
                      borderColor: claimGreen,
                      color: paperLight,
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      boxShadow: `2px 2px 0px ${brass}`,
                    }}
                  >
                    Submit Claim
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default ItemDetails;