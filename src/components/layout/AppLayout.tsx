import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Dropdown, Space, Avatar, Grid } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusCircle, 
  User, 
  FolderHeart, 
  LogOut, 
  Menu as MenuIcon,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

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
const claimGreen = "#3E6C52"; // FOUND tag accent
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

// Fixed header height + a matching menu line-height keeps the logo,
// nav items, and header buttons all sitting on the same baseline
// instead of drifting to different vertical centers.
const HEADER_HEIGHT = 72;

// One shared height for every header-level button/avatar row so
// nothing looks taller or shorter than its neighbour.
const headerControlStyle: React.CSSProperties = {
  height: '38px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Determine active keys based on current path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/items') return 'all-items';
    if (path === '/items/lost') return 'lost-items';
    if (path === '/items/found') return 'found-items';
    if (path === '/my-items') return 'my-items';
    if (path === '/profile') return 'profile';
    return '';
  };

  // Header/footer share the same responsive horizontal rhythm so
  // both edges of the page line up instead of using different
  // paddings at different breakpoints.
  const outerPaddingInline = screens.xs ? 16 : screens.md ? 40 : 24;

  // User Dropdown Menu for Desktop (Ledger Theme)
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>Filer Profile</Link>,
      icon: <User size={15} style={{ color: brass }} />,
    },
    {
      key: 'my-items',
      label: <Link to="/my-items" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>My Reported Cases</Link>,
      icon: <FolderHeart size={15} style={{ color: ink }} />,
    },
    {
      key: 'report-lost',
      label: <Link to="/report/lost" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>Report Lost Item</Link>,
      icon: <PlusCircle size={15} style={{ color: claimRed }} />,
    },
    {
      key: 'report-found',
      label: <Link to="/report/found" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>Report Found Item</Link>,
      icon: <PlusCircle size={15} style={{ color: claimGreen }} />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout} style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>Log Out</span>,
      icon: <LogOut size={15} />,
      danger: true,
    },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: paper, fontFamily: bodyFont }}>
      
      {/* HEADER SECTION — Vintage Ledger Desk Banner */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: paperLight,
          backgroundImage: paperTexture,
          borderBottom: `2px solid ${ink}`,
          paddingInline: outerPaddingInline,
          height: `${HEADER_HEIGHT}px`,
          lineHeight: `${HEADER_HEIGHT}px`,
          boxShadow: `0px 4px 0px ${paperDeep}`,
        }}
      >
        {/* LOGO CONTAINER */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                border: `2px solid ${ink}`,
                backgroundColor: paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: displayFont,
                fontWeight: 700,
                color: ink,
                fontSize: '22px',
                lineHeight: 1,
                boxShadow: `2px 2px 0px ${brass}`,
                flexShrink: 0,
              }}
            >
              U
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
              <span
                style={{
                  fontFamily: displayFont,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: ink,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                }}
              >
                Unstray
              </span>
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: inkSoft,
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                Claim Registry
              </span>
            </div>
          </Link>
        </div>

        {/* CENTRAL NAVIGATION (DESKTOP) */}
        {!screens.xs && !screens.sm ? (
          <Menu
            mode="horizontal"
            selectedKeys={[getActiveKey()]}
            style={{
              flex: 1,
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              fontFamily: monoFont,
              fontSize: '13px',
              textTransform: 'uppercase',
              lineHeight: `${HEADER_HEIGHT - 4}px`,
              height: '100%',
            }}
          >
            <Menu.Item key="home" icon={<Home size={15} style={{ color: ink }} />} style={{ padding: '0 16px', margin: 0 }}>
              <Link to="/" style={{ color: ink }}>Home</Link>
            </Menu.Item>
            <Menu.Item key="lost-items" icon={<Tag size={15} style={{ color: claimRed }} />} style={{ padding: '0 16px', margin: 0 }}>
              <Link to="/items/lost" style={{ color: ink }}>Lost Items</Link>
            </Menu.Item>
            <Menu.Item key="found-items" icon={<Tag size={15} style={{ color: claimGreen }} />} style={{ padding: '0 16px', margin: 0 }}>
              <Link to="/items/found" style={{ color: ink }}>Found Items</Link>
            </Menu.Item>
            <Menu.Item key="all-items" icon={<Search size={15} style={{ color: brass }} />} style={{ padding: '0 16px', margin: 0 }}>
              <Link to="/items" style={{ color: ink }}>All Directory</Link>
            </Menu.Item>
          </Menu>
        ) : null}

        {/* RIGHT SIDE ACTIONS (DESKTOP) */}
        {!screens.xs && !screens.sm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '100%' }}>
            {isAuthenticated && user ? (
              <Space size={20} align="center">
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', ...headerControlStyle }}>
                    <Avatar 
                      size={32}
                      style={{ 
                        backgroundColor: paperDeep, 
                        color: ink,
                        border: `1px solid ${ink}`,
                        fontFamily: displayFont,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <span style={{ fontFamily: monoFont, fontSize: '13px', fontWeight: 600, color: ink, textTransform: 'uppercase', lineHeight: 1 }}>
                      {user.name}
                    </span>
                  </div>
                </Dropdown>
                <Link to="/report/lost">
                  <button
                    style={{
                      ...headerControlStyle,
                      gap: '8px',
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      paddingInline: '18px',
                      backgroundColor: ink,
                      color: paperLight,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `2px 2px 0px ${brass}`,
                    }}
                  >
                    <PlusCircle size={14} /> Report Item
                  </button>
                </Link>
              </Space>
            ) : (
              <Space size={16} align="center">
                <Link to="/login">
                  <button
                    style={{
                      ...headerControlStyle,
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      paddingInline: '18px',
                      backgroundColor: 'transparent',
                      color: ink,
                      border: `1px solid ${ink}`,
                      cursor: 'pointer',
                    }}
                  >
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    style={{
                      ...headerControlStyle,
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      paddingInline: '18px',
                      backgroundColor: ink,
                      color: paperLight,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `2px 2px 0px ${brass}`,
                    }}
                  >
                    Register
                  </button>
                </Link>
              </Space>
            )}
          </div>
        ) : (
          /* MOBILE HAMBURGER BUTTON */
          <Button
            type="text"
            icon={<MenuIcon size={24} style={{ color: ink }} />}
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', padding: 0 }}
          />
        )}
      </Header>

      {/* MOBILE NAVIGATION DRAWER — Ledger File Style */}
      <Drawer
        title={
          <div style={{ fontFamily: displayFont, fontSize: '18px', textTransform: 'uppercase', color: ink }}>
            Unstray Ledger Menu
          </div>
        }
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={290}
        style={{ fontFamily: bodyFont }}
        styles={{
          header: { backgroundColor: paperLight, borderBottom: `2px solid ${ink}`, padding: '18px 24px' },
          body: { backgroundColor: paperLight, padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: `2px dashed ${paperDeep}`, marginBottom: '20px' }}>
                <Avatar size="large" style={{ backgroundColor: paperDeep, color: ink, border: `1px solid ${ink}`, fontFamily: displayFont, fontWeight: 700 }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: '16px', color: ink, textTransform: 'uppercase', lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, marginTop: '3px' }}>{user.email}</div>
                </div>
              </div>
            )}

            <Menu
              mode="vertical"
              selectedKeys={[getActiveKey()]}
              style={{ border: 'none', fontFamily: monoFont, fontSize: '13px', textTransform: 'uppercase', backgroundColor: 'transparent' }}
              onClick={handleMobileLinkClick}
            >
              <Menu.Item key="home" icon={<Home size={16} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                <Link to="/">Home Desk</Link>
              </Menu.Item>
              <Menu.Item key="lost-items" icon={<Tag size={16} style={{ color: claimRed }} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                <Link to="/items/lost">Lost Items</Link>
              </Menu.Item>
              <Menu.Item key="found-items" icon={<Tag size={16} style={{ color: claimGreen }} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                <Link to="/items/found">Found Items</Link>
              </Menu.Item>
              <Menu.Item key="all-items" icon={<Search size={16} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                <Link to="/items">Browse Directory</Link>
              </Menu.Item>

              {isAuthenticated && (
                <>
                  <Menu.Divider style={{ margin: '12px 0' }} />
                  <Menu.Item key="profile" icon={<User size={16} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                    <Link to="/profile">Filer Profile</Link>
                  </Menu.Item>
                  <Menu.Item key="my-items" icon={<FolderHeart size={16} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                    <Link to="/my-items">My Reported Cases</Link>
                  </Menu.Item>
                  <Menu.Item key="report-lost-mob" icon={<PlusCircle size={16} style={{ color: claimRed }} />} style={{ padding: '0 12px', margin: '0 0 4px 0' }}>
                    <Link to="/report/lost">Report Lost</Link>
                  </Menu.Item>
                  <Menu.Item key="report-found-mob" icon={<PlusCircle size={16} style={{ color: claimGreen }} />} style={{ padding: '0 12px', margin: 0 }}>
                    <Link to="/report/found">Report Found</Link>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </div>

          <div style={{ paddingTop: '20px' }}>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  backgroundColor: 'transparent',
                  color: claimRed,
                  border: `2px solid ${claimRed}`,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} /> Log Out Filer
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/login" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <button
                    style={{
                      width: '100%',
                      height: '44px',
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      backgroundColor: 'transparent',
                      color: ink,
                      border: `1px solid ${ink}`,
                      cursor: 'pointer',
                    }}
                  >
                    Log In
                  </button>
                </Link>
                <Link to="/register" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <button
                    style={{
                      width: '100%',
                      height: '44px',
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      backgroundColor: ink,
                      color: paperLight,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `2px 2px 0px ${brass}`,
                    }}
                  >
                    Register Filer
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* CORE CONTENT LAYOUT */}
      <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Content>

      {/* FOOTER SECTION — Ledger Stamped Footer */}
      <Footer
        style={{
          backgroundColor: ink,
          borderTop: `6px solid ${brass}`,
          paddingBlock: '32px',
          paddingInline: outerPaddingInline,
          color: paperLight,
          fontFamily: bodyFont,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', border: `1px solid ${paperLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: displayFont, fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
              U
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily: displayFont, fontWeight: 700, color: paperLight, fontSize: '16px', letterSpacing: '0.5px', lineHeight: 1 }}>
                UNSTRAY REGISTRY
              </span>
              <span style={{ fontFamily: monoFont, fontSize: '11px', color: '#B8C4C1', lineHeight: 1 }}>
                © 2026. Official Community Claim &amp; Lost Property Desk.
              </span>
            </div>
          </div>

          <Space size={24} style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>
            <Link to="/items" style={{ color: '#B8C4C1' }}>Directory Index</Link>
            <a href="#how" style={{ color: '#B8C4C1' }}>Filing Process</a>
            <a href="#about" style={{ color: '#B8C4C1' }}>Privacy &amp; Security</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;