import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Key, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

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
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  phone: z.string().optional().refine((val) => !val || /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val), {
    message: 'Please enter a valid phone number',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorText(null);
    setIsSubmitting(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      message.success('Account created! Welcome to Unstray.');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setErrorText(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '32px 16px',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        fontFamily: bodyFont,
      }}
    >
      {/* REGISTRATION CLAIM TICKET / LEDGER FILE */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          boxShadow: `6px 6px 0px ${ink}`,
          padding: '36px 32px',
        }}
      >
        {/* BRASS GROMMET ACCENT */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: `2px solid ${brass}`,
            background: paper,
          }}
        />

        {/* HEADER LEDGER BANNER */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '1px',
            color: inkSoft,
            textTransform: 'uppercase',
            marginBottom: '20px',
            paddingBottom: '6px',
            borderBottom: `1px dashed ${inkSoft}`,
            width: '100%',
          }}
        >
          <Tag size={12} />
          Unstray Registry — New Filer Application
        </div>

        {/* LOGO & HEADER AREA */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: paper,
              border: `2px solid ${ink}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: ink,
              fontSize: '24px',
              fontFamily: displayFont,
              boxShadow: `3px 3px 0px ${ink}`,
              marginBottom: '16px',
            }}
          >
            U
          </div>
          <Title
            level={3}
            style={{
              margin: 0,
              fontWeight: 700,
              color: ink,
              letterSpacing: '-0.5px',
              fontFamily: displayFont,
              textTransform: 'uppercase',
              fontSize: '24px',
            }}
          >
            Create an Account
          </Title>
          <Text
            style={{
              fontSize: '14px',
              color: inkSoft,
              fontFamily: bodyFont,
              marginTop: '4px',
              display: 'block',
            }}
          >
            Join the Unstray Lost &amp; Found community
          </Text>
        </div>

        {/* ERROR DISPLAY */}
        {errorText && (
          <Alert
            message="Registration Error"
            description={errorText}
            type="error"
            showIcon
            closable
            onClose={() => setErrorText(null)}
            style={{
              marginBottom: '24px',
              borderRadius: 0,
              backgroundColor: '#FBF0EE',
              border: `2px solid ${claimRed}`,
              color: claimRed,
              fontFamily: monoFont,
              fontSize: '13px',
            }}
          />
        )}

        {/* REGISTRATION FORM */}
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          <Form.Item
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
            validateStatus={errors.name ? 'error' : ''}
            help={
              errors.name?.message ? (
                <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>
                  {errors.name.message}
                </span>
              ) : null
            }
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. John Doe"
                  prefix={<User size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${errors.name ? claimRed : ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
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
                Email Address
              </span>
            }
            validateStatus={errors.email ? 'error' : ''}
            help={
              errors.email?.message ? (
                <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>
                  {errors.email.message}
                </span>
              ) : null
            }
            required
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. johndoe@domain.com"
                  prefix={<Mail size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${errors.email ? claimRed : ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
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
                Phone Number (Optional)
              </span>
            }
            validateStatus={errors.phone ? 'error' : ''}
            help={
              errors.phone?.message ? (
                <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>
                  {errors.phone.message}
                </span>
              ) : null
            }
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. +1 (555) 123-4567"
                  prefix={<Phone size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${errors.phone ? claimRed : ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
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
                Password
              </span>
            }
            validateStatus={errors.password ? 'error' : ''}
            help={
              errors.password?.message ? (
                <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>
                  {errors.password.message}
                </span>
              ) : null
            }
            required
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Minimum 6 characters"
                  prefix={<Key size={16} style={{ color: inkSoft, marginRight: '6px' }} />}
                  size="large"
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${errors.password ? claimRed : ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: '12px' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
              icon={<UserPlus size={18} style={{ marginRight: '6px' }} />}
              style={{
                fontFamily: monoFont,
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '13px',
                height: '46px',
                backgroundColor: ink,
                borderColor: ink,
                color: paperLight,
                borderRadius: 0,
                boxShadow: `3px 3px 0px ${brass}`,
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* REDIRECT TO LOGIN */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: `1px dashed ${paperDeep}`,
          }}
        >
          <Text style={{ fontSize: '13px', color: inkSoft, fontFamily: bodyFont }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                fontFamily: monoFont,
                fontWeight: 600,
                color: claimRed,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Log In
            </Link>
          </Text>
        </div>

      </div>
    </div>
  );
};

export default Register;