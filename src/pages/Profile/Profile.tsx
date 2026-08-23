import React, { useState } from 'react';
import { Avatar, Form, Input, Typography, message, Row, Col } from 'antd';
import { User, Mail, Phone, Calendar, Edit3, ShieldAlert, IdCard } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

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
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const Profile: React.FC = () => {
  const { user, updateUserContext } = useAuth();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          backgroundColor: paper,
          backgroundImage: paperTexture,
          padding: '60px',
          fontFamily: bodyFont 
        }}
      >
        <div
          style={{
            padding: '32px 24px',
            backgroundColor: paperLight,
            border: `2px solid ${ink}`,
            boxShadow: `4px 4px 0px ${ink}`,
            textAlign: 'center'
          }}
        >
          <Text style={{ fontFamily: monoFont, fontSize: '13px', color: inkSoft, textTransform: 'uppercase' }}>
            AUTHORIZATION REQUIRED // PLEASE LOG IN TO ACCESS PROFILE FILE.
          </Text>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    form.setFieldsValue({
      name: user.name,
      phone: user.phone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: { name: string; phone: string }) => {
    setIsSaving(true);
    try {
      // Create updated user record
      const updatedUser = {
        ...user,
        name: values.name,
        phone: values.phone,
      };

      // Update in AuthContext/localStorage
      updateUserContext(updatedUser);
      
      message.success('Filer credentials updated successfully!');
      setIsEditModalOpen(false);
    } catch (err: any) {
      message.error('Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

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
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div 
          style={{ 
            borderBottom: `2px solid ${ink}`, 
            paddingBottom: '20px', 
            marginBottom: '32px' 
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
            <IdCard size={14} style={{ color: brass }} />
            Official Filer Identity Card
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
            Account Profile
          </Title>
          <Paragraph style={{ fontFamily: bodyFont, color: inkSoft, margin: '6px 0 0 0', fontSize: '15px' }}>
            Inspect registered credentials and manage official contact details attached to your claims.
          </Paragraph>
        </div>

        <Row gutter={[28, 28]}>
          
          {/* AVATAR SUMMARY STAMP CARD */}
          <Col xs={24} md={9}>
            <div 
              style={{ 
                textAlign: 'center', 
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `6px 6px 0px ${ink}`,
                padding: '36px 20px',
                position: 'relative'
              }}
            >
              {/* Grommet Accent */}
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
                }}
              />

              <Avatar 
                size={84} 
                style={{ 
                  backgroundColor: paperDeep, 
                  color: ink,
                  border: `2px solid ${ink}`,
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: '36px',
                  marginBottom: '16px' 
                }}
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </Avatar>

              <div 
                style={{ 
                  fontFamily: monoFont, 
                  fontSize: '11px', 
                  color: inkSoft, 
                  letterSpacing: '1px', 
                  textTransform: 'uppercase',
                  marginBottom: '4px' 
                }}
              >
                VERIFIED FILER IDENTITY
              </div>

              <Title 
                level={4} 
                style={{ 
                  fontFamily: displayFont, 
                  margin: '0 0 4px 0', 
                  fontWeight: 700, 
                  color: ink,
                  fontSize: '22px',
                  textTransform: 'uppercase'
                }}
              >
                {user.name}
              </Title>

              <Text style={{ fontFamily: monoFont, display: 'block', fontSize: '12px', color: inkSoft, marginBottom: '24px' }}>
                {user.email}
              </Text>
              
              <button 
                onClick={handleEditClick}
                style={{ 
                  width: '100%',
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '12px 16px',
                  backgroundColor: ink,
                  color: paperLight,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `3px 3px 0px ${brass}`
                }}
              >
                <Edit3 size={15} /> Amend Identity File
              </button>
            </div>
          </Col>

          {/* DETAILED INFORMATION LEDGER CARD */}
          <Col xs={24} md={15}>
            <div 
              style={{ 
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `6px 6px 0px ${ink}`,
                padding: '36px 32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div 
                  style={{ 
                    fontFamily: monoFont, 
                    fontSize: '12px', 
                    letterSpacing: '1px', 
                    color: inkSoft, 
                    textTransform: 'uppercase',
                    marginBottom: '18px',
                    borderBottom: `2px solid ${ink}`,
                    paddingBottom: '8px',
                    fontWeight: 700
                  }}
                >
                  OFFICIAL FILER LEDGER DETAILS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* DISPLAY NAME */}
                  <div style={{ backgroundColor: paper, border: `1px solid ${ink}`, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase', marginBottom: '4px' }}>
                      <User size={14} style={{ color: brass }} /> Display Filer Name
                    </div>
                    <div style={{ fontFamily: displayFont, fontSize: '18px', fontWeight: 700, color: ink }}>
                      {user.name}
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div style={{ backgroundColor: paper, border: `1px solid ${ink}`, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase', marginBottom: '4px' }}>
                      <Mail size={14} style={{ color: claimRed }} /> Official Email Address
                    </div>
                    <div style={{ fontFamily: monoFont, fontSize: '14px', fontWeight: 600, color: ink }}>
                      {user.email}
                    </div>
                  </div>

                  {/* PHONE */}
                  <div style={{ backgroundColor: paper, border: `1px solid ${ink}`, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase', marginBottom: '4px' }}>
                      <Phone size={14} style={{ color: ink }} /> Contact Phone Number
                    </div>
                    <div style={{ fontFamily: monoFont, fontSize: '14px', fontWeight: 600, color: ink }}>
                      {user.phone || <span style={{ color: inkSoft, fontStyle: 'italic' }}>[Not Specified]</span>}
                    </div>
                  </div>

                  {/* DATE JOINED */}
                  <div style={{ backgroundColor: paper, border: `1px solid ${ink}`, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: monoFont, fontSize: '11px', color: inkSoft, textTransform: 'uppercase', marginBottom: '4px' }}>
                      <Calendar size={14} style={{ color: brass }} /> Registry Enrollment Date
                    </div>
                    <div style={{ fontFamily: monoFont, fontSize: '13px', color: ink }}>
                      {user.createdAt ? dayjs(user.createdAt).format('MMMM DD, YYYY') : 'August 15, 2026'}
                    </div>
                  </div>

                </div>
              </div>

              {/* SECURITY NOTICE BANNER */}
              <div 
                style={{ 
                  marginTop: '28px', 
                  backgroundColor: paperDeep, 
                  border: `2px solid ${brass}`, 
                  padding: '14px 16px', 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: '12px' 
                }}
              >
                <ShieldAlert size={20} style={{ color: brass, flexShrink: 0, marginTop: '2px' }} />
                <Text style={{ fontFamily: bodyFont, fontSize: '13px', color: ink, lineHeight: 1.5 }}>
                  <strong>Registry Privacy Notice:</strong> Contact credentials are only made accessible to verified users reviewing your specific lost/found reports. Keep credentials accurate to expedite reclaim handovers.
                </Text>
              </div>

            </div>
          </Col>

        </Row>

        {/* EDIT PROFILE MODAL */}
        {isEditModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(32, 48, 58, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: paperLight,
                border: `2px solid ${ink}`,
                boxShadow: `8px 8px 0px ${ink}`,
                padding: '32px 28px',
                position: 'relative'
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

              <div 
                style={{ 
                  fontFamily: displayFont, 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: ink, 
                  textTransform: 'uppercase',
                  marginBottom: '6px' 
                }}
              >
                Amend Profile File
              </div>
              <Paragraph style={{ fontFamily: bodyFont, fontSize: '13px', color: inkSoft, marginBottom: '20px' }}>
                Update display attributes attached to your registered claim tickets.
              </Paragraph>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleEditSubmit}
              >
                <Form.Item
                  name="name"
                  label={
                    <span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                      Full Filer Name
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter your name' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                  style={{ marginBottom: '18px' }}
                >
                  <Input 
                    style={{
                      fontFamily: bodyFont,
                      fontSize: '14px',
                      borderRadius: 0,
                      border: `1px solid ${ink}`,
                      height: '42px',
                      backgroundColor: paper
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={
                    <span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                      Contact Phone Number
                    </span>
                  }
                  rules={[
                    { 
                      pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                      message: 'Please enter a valid phone number format'
                    }
                  ]}
                  style={{ marginBottom: '28px' }}
                >
                  <Input 
                    placeholder="e.g. +94 77 123 4567" 
                    style={{
                      fontFamily: monoFont,
                      fontSize: '13px',
                      borderRadius: 0,
                      border: `1px solid ${ink}`,
                      height: '42px',
                      backgroundColor: paper
                    }}
                  />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: ink,
                      border: `1px solid ${ink}`,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      padding: '10px 20px',
                      backgroundColor: ink,
                      color: paperLight,
                      border: 'none',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      boxShadow: `2px 2px 0px ${brass}`
                    }}
                  >
                    {isSaving ? 'Saving Updates...' : 'Save File Details'}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;