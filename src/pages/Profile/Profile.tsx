import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, Typography, message, Row, Col } from 'antd';
import { User, Mail, Phone, Calendar, Edit3, ShieldAlert, Tag } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

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
          padding: '60px',
          backgroundColor: paper,
          backgroundImage: paperTexture,
          minHeight: '60vh',
          alignItems: 'center',
          fontFamily: bodyFont,
        }}
      >
        <div
          style={{
            backgroundColor: paperLight,
            border: `2px solid ${ink}`,
            padding: '24px 32px',
            boxShadow: `4px 4px 0px ${ink}`,
            textAlign: 'center',
          }}
        >
          <Text style={{ color: inkSoft, fontFamily: monoFont, fontSize: '15px' }}>
            Please log in to view this claim file.
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

      // Save in AuthContext/localStorage
      updateUserContext(updatedUser);
      
      message.success('Profile updated successfully!');
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
        padding: '48px 24px 80px 24px',
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          maxWidth: '920px',
          margin: '0 auto',
        }}
      >
        {/* HEADER SECTION */}
        <div style={{ marginBottom: '32px' }}>
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
              marginBottom: '12px',
              paddingBottom: '4px',
              borderBottom: `1px dashed ${inkSoft}`,
            }}
          >
            <Tag size={13} />
            Registry File — Official Filer Ledger
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
              fontSize: '32px',
            }}
          >
            Account Profile
          </Title>
          <Paragraph style={{ color: inkSoft, margin: '6px 0 0 0', fontSize: '15px', fontFamily: bodyFont }}>
            View and edit your personal profile details and contact file.
          </Paragraph>
        </div>

        <Row gutter={[28, 28]}>
          
          {/* AVATAR SUMMARY CARD */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                position: 'relative',
                textAlign: 'center', 
                borderRadius: 0, 
                boxShadow: `5px 5px 0px ${ink}`,
                border: `2px solid ${ink}`,
                backgroundColor: paperLight,
              }}
              bodyStyle={{ padding: '36px 20px' }}
            >
              {/* BRASS GROMMET ACCENT */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: `2px solid ${brass}`,
                  background: paper,
                }}
              />

              <Avatar 
                size={84} 
                style={{ 
                  backgroundColor: ink,
                  color: paperLight,
                  fontSize: '32px',
                  fontFamily: displayFont,
                  fontWeight: 'bold',
                  border: `2px solid ${brass}`,
                  boxShadow: `3px 3px 0px ${brass}`,
                  marginBottom: '20px' 
                }}
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </Avatar>
              
              <Title
                level={4}
                style={{
                  margin: '0 0 6px 0',
                  fontWeight: 700,
                  color: ink,
                  fontFamily: displayFont,
                  textTransform: 'uppercase',
                  fontSize: '20px',
                }}
              >
                {user.name}
              </Title>
              
              <Text
                style={{
                  display: 'block',
                  fontSize: '13px',
                  marginBottom: '24px',
                  color: inkSoft,
                  fontFamily: monoFont,
                  wordBreak: 'break-all',
                }}
              >
                {user.email}
              </Text>
              
              <Button 
                type="default" 
                onClick={handleEditClick}
                block
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  backgroundColor: paper,
                  border: `2px solid ${ink}`,
                  color: ink,
                  borderRadius: 0,
                  height: '42px',
                  boxShadow: `2px 2px 0px ${ink}`,
                }}
              >
                <Edit3 size={15} style={{ marginRight: '6px' }} />
                Edit Profile
              </Button>
            </Card>
          </Col>

          {/* DETAILED INFORMATION CARD */}
          <Col xs={24} md={16}>
            <Card 
              style={{ 
                borderRadius: 0, 
                boxShadow: `5px 5px 0px ${ink}`,
                border: `2px solid ${ink}`,
                backgroundColor: paperLight,
                height: '100%',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Descriptions
                title={
                  <span
                    style={{
                      fontFamily: displayFont,
                      color: ink,
                      fontSize: '20px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Profile Details
                  </span>
                }
                column={1}
                bordered
                size="middle"
                style={{
                  backgroundColor: paper,
                  border: `1.5px solid ${ink}`,
                  borderRadius: 0,
                  overflow: 'hidden',
                }}
              >
                <Descriptions.Item 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontFamily: monoFont, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                      <User size={15} style={{ color: brass }} /> Display Name
                    </span>
                  }
                >
                  <strong style={{ color: ink, fontFamily: bodyFont, fontSize: '15px' }}>{user.name}</strong>
                </Descriptions.Item>

                <Descriptions.Item 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontFamily: monoFont, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                      <Mail size={15} style={{ color: brass }} /> Email Address
                    </span>
                  }
                >
                  <span style={{ color: ink, fontFamily: monoFont, fontSize: '14px' }}>{user.email}</span>
                </Descriptions.Item>

                <Descriptions.Item 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontFamily: monoFont, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                      <Phone size={15} style={{ color: brass }} /> Contact Phone
                    </span>
                  }
                >
                  {user.phone ? (
                    <span style={{ color: ink, fontFamily: monoFont, fontSize: '14px' }}>{user.phone}</span>
                  ) : (
                    <Text style={{ color: inkSoft, fontStyle: 'italic', fontFamily: bodyFont }}>Not Specified</Text>
                  )}
                </Descriptions.Item>

                <Descriptions.Item 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inkSoft, fontFamily: monoFont, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                      <Calendar size={15} style={{ color: brass }} /> Date Joined
                    </span>
                  }
                >
                  <span style={{ color: ink, fontFamily: monoFont, fontSize: '14px' }}>
                    {user.createdAt ? dayjs(user.createdAt).format('MMMM DD, YYYY') : 'August 15, 2026'}
                  </span>
                </Descriptions.Item>
              </Descriptions>

              {/* SECURITY WARNING / PRIVACY NOTE */}
              <div
                style={{
                  marginTop: '28px',
                  backgroundColor: paper,
                  border: `2px solid ${brass}`,
                  padding: '16px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                }}
              >
                <ShieldAlert size={20} style={{ color: claimRed, flexShrink: 0, marginTop: '2px' }} />
                <Text style={{ fontSize: '13px', lineHeight: 1.6, color: inkSoft, fontFamily: bodyFont }}>
                  For security, <strong style={{ color: ink }}>Unstray</strong> only shares phone and email credentials with users who view items you specifically report. Keep this contact info accurate so finders can reach you directly.
                </Text>
              </div>
            </Card>
          </Col>

        </Row>

        {/* EDIT PROFILE MODAL */}
        <Modal
          title={
            <span style={{ fontFamily: displayFont, color: ink, fontWeight: 700, fontSize: '20px', textTransform: 'uppercase' }}>
              Edit Profile Information
            </span>
          }
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsEditModalOpen(false)}
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
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isSaving}
              onClick={() => form.submit()}
              style={{
                borderRadius: 0,
                backgroundColor: ink,
                border: `2px solid ${ink}`,
                color: paperLight,
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                boxShadow: `2px 2px 0px ${brass}`,
              }}
            >
              Save Details
            </Button>,
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              name="name"
              label={
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: ink,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Full Name
                </span>
              }
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input
                size="large"
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
              name="phone"
              label={
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: ink,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Phone Number
                </span>
              }
              rules={[
                { 
                  pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                  message: 'Please enter a valid phone number format'
                }
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. +1 (555) 123-4567"
                style={{
                  backgroundColor: paper,
                  border: `1.5px solid ${ink}`,
                  borderRadius: 0,
                  fontFamily: bodyFont,
                  color: ink,
                }}
              />
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Profile;