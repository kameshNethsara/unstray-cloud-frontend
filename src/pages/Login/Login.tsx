import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Typography, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

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
// const claimGreen = "#3E6C52"; // FOUND tag accent
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if redirect path is saved in router state
  const from = (location.state as any)?.from?.pathname || '/';
  const isSessionExpired = new URLSearchParams(location.search).get('expired') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorText(null);
    setIsSubmitting(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      message.success('Welcome back to Unstray!');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setErrorText(err.response?.data?.message || err.message || 'Invalid credentials. Please try again.');
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
        minHeight: '85vh',
        padding: '32px 24px',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: paperLight,
          border: `2px solid ${ink}`,
          borderTop: `6px solid ${ink}`,
          boxShadow: `8px 8px 0px ${ink}`,
          padding: '40px 32px',
          position: 'relative',
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

        {/* LOGO & DESK IDENTITY */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              border: `2px solid ${ink}`,
              backgroundColor: paper,
              color: ink,
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: '28px',
              marginBottom: '14px',
              boxShadow: `3px 3px 0px ${brass}`,
            }}
          >
            U
          </div>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: inkSoft,
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Filer Authentication Desk
          </div>
          <Title
            level={3}
            style={{
              fontFamily: displayFont,
              margin: 0,
              fontWeight: 700,
              color: ink,
              fontSize: '28px',
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
            }}
          >
            Log In to Unstray
          </Title>
          <Text style={{ fontFamily: bodyFont, color: inkSoft, fontSize: '14px', marginTop: '4px', display: 'block' }}>
            Access official registry files & claims
          </Text>
        </div>

        {/* NOTIFICATIONS */}
        {isSessionExpired && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: paperDeep,
              border: `2px solid ${brass}`,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} style={{ color: brass, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 700, color: ink, textTransform: 'uppercase' }}>
                Session Expired
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: '13px', color: inkSoft }}>
                Your authority session has ended. Please log in again.
              </div>
            </div>
          </div>
        )}

        {errorText && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: paperDeep,
              border: `2px solid ${claimRed}`,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} style={{ color: claimRed, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 700, color: claimRed, textTransform: 'uppercase' }}>
                Authentication Failed
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: '13px', color: ink }}>
                {errorText}
              </div>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label={
              <span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                Official Email Address
              </span>
            }
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.email.message}</span> : null}
            required
            style={{ marginBottom: '18px' }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. filer@domain.com"
                  prefix={<Mail size={16} style={{ color: ink, marginRight: '6px' }} />}
                  style={{
                    fontFamily: monoFont,
                    fontSize: '13px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '44px',
                    backgroundColor: paper,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 600 }}>
                Secret Password
              </span>
            }
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.password.message}</span> : null}
            required
            style={{ marginBottom: '24px' }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter credential password"
                  prefix={<Key size={16} style={{ color: ink, marginRight: '6px' }} />}
                  style={{
                    fontFamily: monoFont,
                    fontSize: '13px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '44px',
                    backgroundColor: paper,
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                backgroundColor: ink,
                color: paperLight,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: `3px 3px 0px ${brass}`,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <LogIn size={17} /> {isSubmitting ? 'Authenticating...' : 'Log In To Registry'}
            </button>
          </Form.Item>
        </Form>

        {/* REGISTRATION REDIRECT */}
        <div style={{ textAlign: 'center', marginTop: '20px', borderTop: `1px dashed ${paperDeep}`, paddingTop: '16px' }}>
          <Text style={{ fontFamily: bodyFont, fontSize: '13px', color: inkSoft }}>
            New filer on the desk?{' '}
            <Link to="/register" style={{ fontFamily: monoFont, fontWeight: 700, color: ink, textDecoration: 'underline' }}>
              Create an Account
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;