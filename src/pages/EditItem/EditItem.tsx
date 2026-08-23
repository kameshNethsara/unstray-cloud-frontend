import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Breadcrumb, message, Button } from 'antd';
import { FileEdit, ShieldAlert } from 'lucide-react';
import { itemService } from '../../services/itemService';
import { useAuth } from '../../contexts/AuthContext';
import ItemForm from '../../components/forms/ItemForm';
import type { ItemFormData } from '../../components/forms/ItemForm';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import type { Item } from '../../types/item';

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
const claimGreen = "#3E6C52"; // FOUND tag accent
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error('Failed to load item for edit:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Retrieving file from registry..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: bodyFont }}>
        <ErrorState
          title="File Not Found"
          message="The record you are attempting to edit could not be retrieved from the registry ledger."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Security authorization check: Only owner can edit
  const isOwner = currentUser && item.userId === currentUser.id;
  if (!isOwner) {
    return (
      <div
        style={{
          maxWidth: '680px',
          margin: '80px auto',
          padding: '40px 32px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `6px 6px 0px ${ink}`,
          fontFamily: bodyFont,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: '12px',
            border: `2px solid ${claimRed}`,
            color: claimRed,
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <Title
          level={2}
          style={{
            fontFamily: displayFont,
            color: ink,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            margin: '0 0 12px 0',
          }}
        >
          Access Restricted
        </Title>
        <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, fontSize: '15px', marginBottom: '28px' }}>
          You do not hold administrative authority over File No. {String(item.id).padStart(5, '0').slice(-5)}. Only the original claim filer may amend this entry.
        </Paragraph>
        <Button
          onClick={() => navigate(`/items/${item.id}`)}
          style={{
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            height: '42px',
            padding: '0 24px',
            backgroundColor: ink,
            color: paperLight,
            border: 'none',
            borderRadius: 0,
            cursor: 'pointer',
          }}
        >
          Return to Case File
        </Button>
      </div>
    );
  }

  const handleFormSubmit = async (data: ItemFormData & { formattedDate: string }) => {
    setIsUpdating(true);
    try {
      await itemService.updateItem(item.id, {
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category as any,
        location: data.location,
        media: data.media,
        createdAt: data.formattedDate,
      });

      message.success('Registry record updated successfully!');
      navigate(`/items/${item.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to update report. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Convert Item to ItemForm format
  const formInitialValues = {
    title: item.title,
    description: item.description,
    type: item.type,
    category: item.category,
    location: item.location,
    dateString: item.createdAt, // fallback to createdAt if not specified
    media: item.media,
  };

  const isLost = item.type === 'LOST';

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        padding: '48px 24px 88px 24px',
        fontFamily: bodyFont,
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* BREADCRUMB */}
        <Breadcrumb
          style={{
            fontFamily: monoFont,
            fontSize: '12px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          <Breadcrumb.Item>
            <Link to="/" style={{ color: inkSoft }}>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/items" style={{ color: inkSoft }}>
              Registry
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/items/${item.id}`} style={{ color: inkSoft }}>
              File No. {String(item.id).padStart(5, '0').slice(-5)}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item style={{ color: ink, fontWeight: 700 }}>
            Amend Entry
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* HEADER BLOCK */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: `2px solid ${ink}`,
            paddingBottom: '20px',
            marginBottom: '32px',
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
                marginBottom: '8px',
              }}
            >
              <FileEdit size={14} style={{ color: brass }} />
              Amend Registry Entry — Case No. {String(item.id).padStart(5, '0').slice(-5)}
            </div>
            <Title
              level={2}
              style={{
                fontFamily: displayFont,
                fontSize: '36px',
                fontWeight: 700,
                color: ink,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
              }}
            >
              Update Record
            </Title>
            <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, margin: '6px 0 0 0', fontSize: '15px' }}>
              Modify official attributes, location, or descriptive logs for this record.
            </Paragraph>
          </div>

          <div
            style={{
              padding: '6px 14px',
              border: `2px solid ${isLost ? claimRed : claimGreen}`,
              color: isLost ? claimRed : claimGreen,
              fontFamily: monoFont,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              backgroundColor: paperLight,
              transform: 'rotate(-1deg)',
            }}
          >
            ● {item.type} ITEM
          </div>
        </div>

        {/* FORM CONTAINER - Claim Ticket Ledger style */}
        <div
          style={{
            position: 'relative',
            backgroundColor: paperLight,
            border: `2px solid ${ink}`,
            borderLeft: `8px solid ${isLost ? claimRed : claimGreen}`,
            boxShadow: `6px 6px 0px ${ink}`,
            padding: '40px 32px',
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

          <ItemForm
            initialValues={formInitialValues}
            onSubmit={handleFormSubmit}
            isSubmitting={isUpdating}
            submitButtonText="Save Entry Updates"
          />
        </div>
      </div>
    </div>
  );
};

export default EditItem;