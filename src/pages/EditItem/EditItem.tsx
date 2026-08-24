import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Breadcrumb, message, Result, Button } from 'antd';
import { Edit as EditIcon } from 'lucide-react';
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
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
// const paperDeep = "#E2D8C1"; // recessed paper
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
    return <LoadingState message="Fetching item file for amendment..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <ErrorState
          title="Listing Not Found"
          message="The listing you are trying to edit could not be loaded."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Security authorization check: Only owner can edit (handling number/string ID comparison safely)
  const isOwner = currentUser && Number(item.reportedBy) === Number(currentUser.id);
  if (!isOwner) {
    return (
      <div 
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          backgroundColor: paper, 
          backgroundImage: paperTexture, 
          padding: '80px 24px', 
          fontFamily: bodyFont 
        }}
      >
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <Card
            style={{
              borderRadius: 0,
              border: `2px solid ${ink}`,
              boxShadow: `6px 6px 0px ${ink}`,
              backgroundColor: paperLight,
              textAlign: 'center',
            }}
            styles={{ body: { padding: '32px' } }}
          >
            <Result
              status="403"
              title={<span style={{ fontFamily: displayFont, textTransform: 'uppercase', color: ink, fontWeight: 700, fontSize: '24px' }}>Access Denied</span>}
              subTitle={<span style={{ fontFamily: bodyFont, color: inkSoft, fontSize: '14px' }}>You do not have permission to edit this listing because you are not the registered reporter.</span>}
              extra={
                <Button 
                  type="primary" 
                  onClick={() => navigate(`/items/${item.id}`)}
                  style={{
                    borderRadius: 0,
                    backgroundColor: ink,
                    borderColor: ink,
                    color: paperLight,
                    fontFamily: monoFont,
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    height: '42px',
                    padding: '0 24px',
                    boxShadow: `3px 3px 0px ${brass}`,
                  }}
                >
                  Back to Item File
                </Button>
              }
            />
          </Card>
        </div>
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
        imageUrls: data.imageUrls,
        date: data.formattedDate,
        ownerName: item.ownerName || currentUser?.name || currentUser?.name,
        ownerEmail: item.ownerEmail || currentUser?.email,
        ownerPhone: item.ownerPhone || currentUser?.phone,
      });

      message.success('Listing details updated successfully!');
      navigate(`/items/${item.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to update report. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Convert Item to ItemForm format using imageUrls list
  const formInitialValues = {
    title: item.title,
    description: item.description,
    type: item.type,
    category: item.category,
    location: item.location,
    dateString: item.date || item.createdAt,
    imageUrls: item.imageUrls || [],
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* BREADCRUMB */}
        <Breadcrumb 
          style={{ marginBottom: '16px', fontFamily: monoFont, fontSize: '12px' }}
          items={[
            { title: <Link to="/" style={{ color: inkSoft }}>Home</Link> },
            { title: <Link to="/items" style={{ color: inkSoft }}>Browse Directory</Link> },
            { title: <Link to={`/items/${item.id}`} style={{ color: inkSoft }}>Case #{String(item.id).padStart(5, '0')}</Link> },
            { title: <span style={{ color: ink }}>Edit Record</span> }
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
              marginBottom: '8px',
              paddingBottom: '4px',
              borderBottom: `1px dashed ${inkSoft}`,
            }}
          >
            <EditIcon size={13} style={{ color: brass }} />
            Docket Amendment — Record #{String(item.id).padStart(5, '0')}
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
            Edit Item Details
          </Title>
          <Paragraph style={{ color: inkSoft, margin: '6px 0 0 0', fontSize: '15px', fontFamily: bodyFont }}>
            Update the physical attributes, status, or description for your registered item.
          </Paragraph>
        </div>

        {/* CARD CONTAINER */}
        <Card
          style={{
            borderRadius: 0,
            boxShadow: `6px 6px 0px ${ink}`,
            border: `2px solid ${ink}`,
            backgroundColor: paperLight,
          }}
          styles={{ body: { padding: '36px' } }}
        >
          <ItemForm
            initialValues={formInitialValues}
            onSubmit={handleFormSubmit}
            isSubmitting={isUpdating}
            submitButtonText="Save Changes"
          />
        </Card>
        
      </div>
    </div>
  );
};

export default EditItem;