import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, Tag } from 'lucide-react';
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
        minHeight: '100vh',
        padding: '32px 16px',
        backgroundColor: paper,
        backgroundImage: paperTexture,
        fontFamily: bodyFont,
      }}
    >
      {/* LOGIN CLAIM TICKET / LEDGER FILE */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
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
          Unstray Registry — Access File
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
            Log In to Unstray
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
            Reconnect with your belongings
          </Text>
        </div>

        {/* NOTIFICATIONS */}
        {isSessionExpired && (
          <Alert
            message="Session Expired"
            description="Your login session has expired. Please log in again."
            type="warning"
            showIcon
            closable
            style={{
              marginBottom: '20px',
              borderRadius: 0,
              backgroundColor: paper,
              border: `2px solid ${brass}`,
              color: ink,
              fontFamily: monoFont,
              fontSize: '13px',
            }}
          />
        )}

        {errorText && (
          <Alert
            message="Login Failed"
            description={errorText}
            type="error"
            showIcon
            closable
            onClose={() => setErrorText(null)}
            style={{
              marginBottom: '20px',
              borderRadius: 0,
              backgroundColor: '#FBF0EE',
              border: `2px solid ${claimRed}`,
              color: claimRed,
              fontFamily: monoFont,
              fontSize: '13px',
            }}
          />
        )}

        {/* LOGIN FORM */}
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
                  placeholder="e.g. yourname@domain.com"
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
                  placeholder="Enter your password"
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
              icon={<LogIn size={18} style={{ marginRight: '6px' }} />}
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
              Log In
            </Button>
          </Form.Item>
        </Form>

        {/* REGISTRATION REDIRECT */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: `1px dashed ${paperDeep}`,
          }}
        >
          <Text style={{ fontSize: '13px', color: inkSoft, fontFamily: bodyFont }}>
            New to Unstray?{' '}
            <Link
              to="/register"
              style={{
                fontFamily: monoFont,
                fontWeight: 600,
                color: claimRed,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Create an Account
            </Link>
          </Text>
        </div>

      </div>
    </div>
  );
};

export default Login;