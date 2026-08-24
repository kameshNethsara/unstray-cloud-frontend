import React, { useState } from 'react';
import { Card, Typography, Breadcrumb, message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import ItemForm from '../../components/forms/ItemForm';
import type { ItemFormData } from '../../components/forms/ItemForm';
import { itemService } from '../../services/itemService';

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
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const CreateItem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Determine if reporting lost or found based on the route
  const isLostRoute = location.pathname.includes('/report/lost');
  const pageTitle = isLostRoute ? 'Report a Lost Item' : 'Report a Found Item';
  const pageSubtitle = isLostRoute
    ? 'Provide details about the item you lost so others can help you find it.'
    : 'Provide details about the item you found so its owner can get it back.';
  const submitText = isLostRoute ? 'Report Lost Item' : 'Report Found Item';
  const itemType = isLostRoute ? 'LOST' : 'FOUND';

  const handleFormSubmit = async (data: ItemFormData & { formattedDate: string }) => {
    setIsSubmitting(true);
    try {
      const createdItem = await itemService.createItem({
        title: data.title,
        description: data.description,
        type: itemType,
        category: data.category as any,
        location: data.location,
        imageUrls: data.imageUrls,
        date: data.formattedDate,
      });

      // Show toast message
      message.success(`${pageTitle} submitted successfully!`);
      // Redirect to newly created item details page
      navigate(`/items/${createdItem.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            { title: <span style={{ color: inkSoft }}>Report</span> },
            { title: <span style={{ color: ink }}>{isLostRoute ? 'Lost Item' : 'Found Item'}</span> }
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
            <PlusCircle size={13} style={{ color: isLostRoute ? claimRed : claimGreen }} />
            Unstray Registry — New Intake Form
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
            {pageTitle}
          </Title>
          <Paragraph style={{ color: inkSoft, margin: '6px 0 0 0', fontSize: '15px', fontFamily: bodyFont }}>
            {pageSubtitle}
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
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={submitText}
            fixedType={itemType}
          />
        </Card>
        
      </div>
    </div>
  );
};

export default CreateItem;