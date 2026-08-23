import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Button, 
  Typography, 
  // Space, 
  Carousel, 
  Modal, 
  message,
  Breadcrumb
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
  Share2,
  // FileText,
  ShieldCheck,
  // AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import { itemService } from '../../services/itemService';
import type { Item, ItemStatus } from '../../types/item';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

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
    return <LoadingState message="Fetching case file from registry..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: bodyFont }}>
        <ErrorState 
          title="Case File Not Found"
          message="The item listing you are looking for may have been removed, closed, or is temporarily unretrievable."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Permission Check
  const isOwner = currentUser && item.userId === currentUser.id;
  const isLost = item.type === 'LOST';
  const isOpen = item.status === 'OPEN';

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
      const updated = await itemService.updateItem(item.id, { status: newStatus });
      setItem(updated);
      message.success(`Listing status marked as ${newStatus}.`);
      setIsResolveOpen(false);
    } catch (err) {
      message.error('Failed to update listing status.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReportListing = () => {
    message.info('Thank you. A moderator has been notified about this listing.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Case ledger link copied to clipboard!');
  };

  // Image assets gallery logic
  const imageGallery = item.media && item.media.length > 0
    ? item.media
    : ['https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop&q=80'];

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* BREADCRUMBS & BACK BUTTON */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            borderBottom: `1px dashed ${inkSoft}`,
            paddingBottom: '12px'
          }}
        >
          <Breadcrumb style={{ fontFamily: monoFont, fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <Breadcrumb.Item><Link to="/" style={{ color: inkSoft }}>Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/items" style={{ color: inkSoft }}>Registry Directory</Link></Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: ink, fontWeight: 700 }}>Case No. {String(item.id).padStart(5, '0').slice(-5)}</Breadcrumb.Item>
          </Breadcrumb>
          <Button 
            type="text" 
            icon={<ChevronLeft size={16} />} 
            onClick={() => navigate(-1)}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontFamily: monoFont,
              fontSize: '12px',
              fontWeight: 700, 
              color: ink,
              textTransform: 'uppercase'
            }}
          >
            Return
          </Button>
        </div>

        <Row gutter={[32, 32]}>
          {/* LEFT PANEL: EVIDENCE & ATTACHMENTS (IMAGE GALLERY) */}
          <Col xs={24} md={11}>
            <div 
              style={{ 
                position: 'relative',
                backgroundColor: paperLight, 
                border: `2px solid ${ink}`, 
                boxShadow: `6px 6px 0px ${ink}`,
                padding: '16px' 
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
                  backgroundColor: paper,
                  zIndex: 2
                }}
              />

              <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ATTACHED EVIDENCE // PHOTO PROOF
              </div>

              {imageGallery.length > 1 ? (
                <Carousel arrows infinite={false} style={{ background: ink, border: `1px solid ${ink}` }}>
                  {imageGallery.map((url, idx) => (
                    <div key={idx} style={{ height: '420px', width: '100%' }}>
                      <img 
                        src={url} 
                        alt={`${item.title} item media ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: ink }} 
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div style={{ height: '420px', width: '100%', border: `1px solid ${ink}`, overflow: 'hidden' }}>
                  <img 
                    src={imageGallery[0]} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <div 
                style={{ 
                  marginTop: '12px', 
                  paddingTop: '8px', 
                  borderTop: `1px dashed ${paperDeep}`, 
                  fontFamily: monoFont, 
                  fontSize: '11px', 
                  color: inkSoft,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>FILE REF: {String(item.id).padStart(5, '0').slice(-5)}</span>
                <span>VERIFIED REGISTRY ENTRY</span>
              </div>
            </div>
          </Col>

          {/* RIGHT PANEL: CASE FILE SPECIFICATIONS & ACTIONS */}
          <Col xs={24} md={13}>
            <div 
              style={{ 
                position: 'relative',
                backgroundColor: paperLight, 
                border: `2px solid ${ink}`,
                borderLeft: `8px solid ${isLost ? claimRed : claimGreen}`,
                boxShadow: `6px 6px 0px ${ink}`,
                padding: '36px 32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
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

              <div>
                {/* CASE STAMPS & BADGES */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <div 
                    style={{ 
                      padding: '4px 12px', 
                      border: `2px solid ${isLost ? claimRed : claimGreen}`, 
                      color: isLost ? claimRed : claimGreen,
                      fontFamily: monoFont,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      backgroundColor: paperLight,
                      transform: 'rotate(-1deg)'
                    }}
                  >
                    ● {item.type} CLAIM
                  </div>
                  
                  <div 
                    style={{ 
                      padding: '4px 12px', 
                      border: `2px solid ${isOpen ? ink : inkSoft}`, 
                      color: isOpen ? ink : inkSoft,
                      fontFamily: monoFont,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      backgroundColor: isOpen ? paperDeep : 'transparent',
                      transform: 'rotate(0.8deg)'
                    }}
                  >
                    STATUS: {item.status}
                  </div>
                </div>

                {/* CASE TITLE */}
                <Title 
                  level={1} 
                  style={{ 
                    fontFamily: displayFont, 
                    fontSize: '38px',
                    fontWeight: 700, 
                    color: ink,
                    margin: '0 0 16px 0',
                    lineHeight: 1.15,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px'
                  }}
                >
                  {item.title}
                </Title>

                {/* FILE METADATA LEDGER */}
                <div 
                  style={{ 
                    backgroundColor: paper, 
                    border: `1px solid ${ink}`, 
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: inkSoft, fontSize: '13px' }}>
                    <CategoryIcon size={15} style={{ color: brass }} />
                    <span style={{ fontFamily: monoFont, textTransform: 'uppercase', fontWeight: 600, color: ink }}>
                      CATEGORY:
                    </span>
                    <span style={{ fontFamily: monoFont, color: ink }}>{item.category}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: inkSoft, fontSize: '13px' }}>
                    <MapPin size={15} style={{ color: claimRed }} />
                    <span style={{ fontFamily: monoFont, textTransform: 'uppercase', fontWeight: 600, color: ink }}>
                      LOCATION:
                    </span>
                    <span style={{ fontFamily: bodyFont, fontWeight: 600, color: ink }}>{item.location}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: inkSoft, fontSize: '13px' }}>
                    <Calendar size={15} style={{ color: claimGreen }} />
                    <span style={{ fontFamily: monoFont, textTransform: 'uppercase', fontWeight: 600, color: ink }}>
                      RECORDED:
                    </span>
                    <span style={{ fontFamily: monoFont, color: inkSoft }}>
                      {dayjs(item.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div style={{ marginBottom: '28px' }}>
                  <div 
                    style={{ 
                      fontFamily: monoFont, 
                      fontSize: '11px', 
                      letterSpacing: '1px', 
                      color: inkSoft, 
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      borderBottom: `1px dashed ${inkSoft}`,
                      paddingBottom: '4px'
                    }}
                  >
                    ITEM DESCRIPTION & CLAIMS
                  </div>
                  <Paragraph 
                    style={{ 
                      fontFamily: bodyFont, 
                      color: ink, 
                      fontSize: '15px', 
                      lineHeight: 1.65, 
                      whiteSpace: 'pre-wrap', 
                      marginBottom: 0 
                    }}
                  >
                    {item.description}
                  </Paragraph>
                </div>
                
                {/* RESOLVED ALERT BANNER */}
                {!isOpen && (
                  <div 
                    style={{ 
                      padding: '14px 18px', 
                      backgroundColor: paperDeep, 
                      border: `2px solid ${claimGreen}`, 
                      marginBottom: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <ShieldCheck size={22} style={{ color: claimGreen, flexShrink: 0 }} />
                    <span style={{ fontFamily: monoFont, fontSize: '12px', color: claimGreen, fontWeight: 700, textTransform: 'uppercase' }}>
                      THIS CASE HAS BEEN MARKED RESOLVED AND RECLAIMED.
                    </span>
                  </div>
                )}
              </div>

              {/* ACTION STAMPS & BUTTONS */}
              <div style={{ borderTop: `2px solid ${ink}`, paddingTop: '20px', marginTop: '16px' }}>
                {isOwner ? (
                  /* OWNER CONTROLS PANEL */
                  <div style={{ backgroundColor: paper, border: `1px solid ${ink}`, padding: '16px' }}>
                    <Text 
                      style={{ 
                        display: 'block', 
                        marginBottom: '12px', 
                        fontFamily: monoFont, 
                        fontSize: '11px', 
                        color: inkSoft,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      YOU ARE THE FILER OF THIS RECORD. MANAGE FILE BELOW:
                    </Text>
                    <Row gutter={[10, 10]}>
                      <Col xs={24} sm={10}>
                        <button 
                          onClick={() => setIsResolveOpen(true)}
                          style={{ 
                            width: '100%',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '6px',
                            fontFamily: monoFont,
                            fontWeight: 700,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '10px 12px',
                            backgroundColor: isOpen ? claimGreen : ink,
                            color: paperLight,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle size={15} /> {isOpen ? 'Mark Resolved' : 'Reopen Case'}
                        </button>
                      </Col>
                      <Col xs={12} sm={7}>
                        <Link to={`/items/${item.id}/edit`}>
                          <button 
                            style={{ 
                              width: '100%',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '6px',
                              fontFamily: monoFont,
                              fontWeight: 700,
                              fontSize: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              padding: '10px 12px',
                              backgroundColor: 'transparent',
                              color: ink,
                              border: `1px solid ${ink}`,
                              cursor: 'pointer'
                            }}
                          >
                            <Edit size={15} /> Amend
                          </button>
                        </Link>
                      </Col>
                      <Col xs={12} sm={7}>
                        <button 
                          onClick={() => setIsDeleteOpen(true)}
                          style={{ 
                            width: '100%',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '6px',
                            fontFamily: monoFont,
                            fontWeight: 700,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '10px 12px',
                            backgroundColor: 'transparent',
                            color: claimRed,
                            border: `1px solid ${claimRed}`,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  /* GUEST ACTIONS PANEL */
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={14}>
                      <button 
                        disabled={!isOpen}
                        onClick={() => {
                          if (isAuthenticated) {
                            setIsContactOpen(true);
                          } else {
                            message.warning('Please log in to contact the owner.');
                            navigate('/login', { state: { from: { pathname: `/items/${item.id}` } } });
                          }
                        }}
                        style={{ 
                          width: '100%',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '8px',
                          fontFamily: monoFont,
                          fontWeight: 700,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          padding: '14px 16px',
                          backgroundColor: isOpen ? ink : paperDeep,
                          color: isOpen ? paperLight : inkSoft,
                          border: 'none',
                          cursor: isOpen ? 'pointer' : 'not-allowed',
                          boxShadow: isOpen ? `3px 3px 0px ${brass}` : 'none'
                        }}
                      >
                        <Mail size={16} /> Contact Filer Desk
                      </button>
                    </Col>
                    <Col xs={12} sm={5}>
                      <button 
                        onClick={handleShare}
                        style={{ 
                          width: '100%',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '6px',
                          fontFamily: monoFont,
                          fontWeight: 700,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          padding: '14px 12px',
                          backgroundColor: 'transparent',
                          color: ink,
                          border: `1px solid ${ink}`,
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={15} /> Share
                      </button>
                    </Col>
                    <Col xs={12} sm={5}>
                      <button 
                        onClick={handleReportListing}
                        style={{ 
                          width: '100%',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '6px',
                          fontFamily: monoFont,
                          fontWeight: 700,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          padding: '14px 12px',
                          backgroundColor: 'transparent',
                          color: claimRed,
                          border: `1px solid ${claimRed}`,
                          cursor: 'pointer'
                        }}
                      >
                        <Flag size={15} /> Flag
                      </button>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* CONFIRM DELETE DIALOG */}
        <ConfirmDialog
          open={isDeleteOpen}
          title="Expunge Record?"
          content="Are you sure you want to permanently delete this registry listing? This case file will be expunged completely."
          okText="Expunge Record"
          danger
          confirmLoading={isSubmittingAction}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
        />

        {/* CONFIRM RESOLVE DIALOG */}
        <ConfirmDialog
          open={isResolveOpen}
          title={isOpen ? 'Mark Case as Resolved?' : 'Reopen Registry Case?'}
          content={
            isOpen 
              ? 'Marking this item as resolved logs that it has been returned or found. The record remains archived in registry files.'
              : 'Would you like to reopen this item for active community matching?'
          }
          okText={isOpen ? 'Mark Resolved' : 'Reopen Case'}
          confirmLoading={isSubmittingAction}
          onConfirm={handleResolveConfirm}
          onCancel={() => setIsResolveOpen(false)}
        />

        {/* CONTACT OWNER MODAL */}
        <Modal
          open={isContactOpen}
          title={
            <div style={{ fontFamily: displayFont, color: ink, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Filer Contact Desk
            </div>
          }
          onCancel={() => setIsContactOpen(false)}
          footer={[
            <Button 
              key="close" 
              onClick={() => setIsContactOpen(false)} 
              style={{
                fontFamily: monoFont,
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: `1px solid ${ink}`,
                borderRadius: 0,
                backgroundColor: ink,
                color: paperLight
              }}
            >
              Close Ledger Entry
            </Button>
          ]}
          destroyOnClose
          style={{ fontFamily: bodyFont }}
        >
          <div style={{ padding: '16px 0' }}>
            <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, fontSize: '14px', marginBottom: '20px' }}>
              Get in touch directly with the verified report filer to coordinate verification and handover details.
            </Paragraph>
            
            <div 
              style={{ 
                backgroundColor: paper, 
                border: `2px solid ${ink}`, 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={18} style={{ color: brass }} />
                <div>
                  <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase' }}>Filer Identity</div>
                  <div style={{ fontFamily: bodyFont, fontWeight: 700, color: ink, fontSize: '15px' }}>{item.ownerName || 'Verified User'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} style={{ color: claimRed }} />
                <div>
                  <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase' }}>Official Email</div>
                  <div>
                    {item.ownerEmail ? (
                      <a href={`mailto:${item.ownerEmail}?subject=Unstray - Regarding File ${item.title}`} style={{ fontFamily: monoFont, color: ink, fontWeight: 600, textDecoration: 'underline' }}>
                        {item.ownerEmail}
                      </a>
                    ) : (
                      <span style={{ fontFamily: monoFont, color: inkSoft }}>Not Provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ color: claimGreen }} />
                <div>
                  <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase' }}>Phone Contact</div>
                  <div>
                    {item.ownerPhone ? (
                      <a href={`tel:${item.ownerPhone}`} style={{ fontFamily: monoFont, color: ink, fontWeight: 600, textDecoration: 'underline' }}>
                        {item.ownerPhone}
                      </a>
                    ) : (
                      <span style={{ fontFamily: monoFont, color: inkSoft }}>Not Provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default ItemDetails;