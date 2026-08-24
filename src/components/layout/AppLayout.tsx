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
  // Tag as TagIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

const paperTexture =
  "repeating-linear-gradient(135deg, rgba(32,48,58,0.025) 0px, rgba(32,48,58,0.025) 1px, transparent 1px, transparent 10px)";

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

  // User Dropdown Menu for Desktop
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>My Profile</Link>,
      icon: <User size={15} style={{ color: inkSoft }} />,
    },
    {
      key: 'my-items',
      label: <Link to="/my-items" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>My Reported Items</Link>,
      icon: <FolderHeart size={15} style={{ color: inkSoft }} />,
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
      label: <span onClick={handleLogout} style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>Log Out</span>,
      icon: <LogOut size={15} />,
      danger: true,
    },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: paper, fontFamily: bodyFont }}>
      {/* HEADER SECTION */}
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
          boxShadow: `0px 4px 0px ${paperDeep}`,
          padding: screens.xs ? '0 16px' : '0 40px',
          height: '64px',
        }}
      >
        {/* LOGO CONTAINER */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 0,
                backgroundColor: ink,
                border: `1.5px solid ${ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: paperLight,
                fontFamily: displayFont,
                fontSize: '18px',
                boxShadow: `2px 2px 0px ${brass}`,
              }}
            >
              U
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: displayFont,
                color: ink,
                letterSpacing: '-0.5px',
                textTransform: 'uppercase',
              }}
            >
              Unstray
            </span>
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
              fontSize: '13px',
              fontFamily: monoFont,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <Menu.Item key="home" icon={<Home size={14} style={{ color: ink }} />}>
              <Link to="/" style={{ color: ink }}>Home</Link>
            </Menu.Item>
            <Menu.Item key="lost-items" icon={<Search size={14} style={{ color: claimRed }} />}>
              <Link to="/items/lost" style={{ color: ink }}>Lost Items</Link>
            </Menu.Item>
            <Menu.Item key="found-items" icon={<Search size={14} style={{ color: claimGreen }} />}>
              <Link to="/items/found" style={{ color: ink }}>Found Items</Link>
            </Menu.Item>
            <Menu.Item key="all-items" icon={<Search size={14} style={{ color: brass }} />}>
              <Link to="/items" style={{ color: ink }}>Directory</Link>
            </Menu.Item>
          </Menu>
        ) : null}

        {/* RIGHT SIDE ACTIONS (DESKTOP) */}
        {!screens.xs && !screens.sm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated && user ? (
              <Space size="middle">
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Avatar 
                      shape="square"
                      style={{ 
                        backgroundColor: ink, 
                        color: paperLight,
                        fontFamily: monoFont,
                        fontWeight: 700,
                        border: `1px solid ${ink}`,
                        borderRadius: 0
                      }}
                    >
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <span style={{ fontWeight: 600, color: ink, fontFamily: monoFont, fontSize: '13px' }}>{user.name}</span>
                  </div>
                </Dropdown>
                <Link to="/report/lost">
                  <Button 
                    type="primary" 
                    icon={<PlusCircle size={15} style={{ marginRight: '4px' }} />}
                    style={{
                      borderRadius: 0,
                      backgroundColor: claimRed,
                      borderColor: claimRed,
                      color: paperLight,
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      height: '36px',
                      boxShadow: `2px 2px 0px ${ink}`,
                    }}
                  >
                    Report Item
                  </Button>
                </Link>
              </Space>
            ) : (
              <Space size="middle">
                <Link to="/login">
                  <Button 
                    type="text" 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      fontFamily: monoFont, 
                      textTransform: 'uppercase',
                      color: ink 
                    }}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    type="primary" 
                    style={{ 
                      fontWeight: 700, 
                      fontFamily: monoFont, 
                      fontSize: '12px', 
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      backgroundColor: ink,
                      borderColor: ink,
                      color: paperLight,
                      boxShadow: `2px 2px 0px ${brass}`
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </Space>
            )}
          </div>
        ) : (
          /* MOBILE HAMBURGER BUTTON */
          <Button
            type="text"
            icon={<MenuIcon size={22} style={{ color: ink }} />}
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        )}
      </Header>

      {/* MOBILE NAVIGATION DRAWER */}
      <Drawer
        title={<span style={{ fontFamily: displayFont, textTransform: 'uppercase', color: ink, fontWeight: 700, fontSize: '18px' }}>Unstray Registry</span>}
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={290}
        styles={{
          header: { backgroundColor: paperLight, borderBottom: `2px solid ${ink}` },
          body: { backgroundColor: paper, backgroundImage: paperTexture, padding: '20px' }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: `1px dashed ${inkSoft}`, marginBottom: '20px' }}>
                <Avatar 
                  shape="square" 
                  size="large" 
                  style={{ backgroundColor: ink, color: paperLight, fontFamily: monoFont, fontWeight: 700, borderRadius: 0, border: `1px solid ${ink}` }}
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', fontFamily: displayFont, color: ink, textTransform: 'uppercase' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: inkSoft, fontFamily: monoFont }}>{user.email}</div>
                </div>
              </div>
            )}

            <Menu
              mode="vertical"
              selectedKeys={[getActiveKey()]}
              style={{ border: 'none', background: 'transparent', fontSize: '13px', fontFamily: monoFont, textTransform: 'uppercase' }}
              onClick={handleMobileLinkClick}
            >
              <Menu.Item key="home" icon={<Home size={16} style={{ color: ink }} />}>
                <Link to="/" style={{ color: ink }}>Home</Link>
              </Menu.Item>
              <Menu.Item key="lost-items" icon={<Search size={16} style={{ color: claimRed }} />}>
                <Link to="/items/lost" style={{ color: ink }}>Lost Items</Link>
              </Menu.Item>
              <Menu.Item key="found-items" icon={<Search size={16} style={{ color: claimGreen }} />}>
                <Link to="/items/found" style={{ color: ink }}>Found Items</Link>
              </Menu.Item>
              <Menu.Item key="all-items" icon={<Search size={16} style={{ color: brass }} />}>
                <Link to="/items" style={{ color: ink }}>Directory</Link>
              </Menu.Item>

              {isAuthenticated && (
                <>
                  <Menu.Divider />
                  <Menu.Item key="profile" icon={<User size={16} style={{ color: inkSoft }} />}>
                    <Link to="/profile" style={{ color: ink }}>My Profile</Link>
                  </Menu.Item>
                  <Menu.Item key="my-items" icon={<FolderHeart size={16} style={{ color: inkSoft }} />}>
                    <Link to="/my-items" style={{ color: ink }}>My Reported Items</Link>
                  </Menu.Item>
                  <Menu.Item key="report-lost-mob" icon={<PlusCircle size={16} style={{ color: claimRed }} />}>
                    <Link to="/report/lost" style={{ color: ink }}>Report Lost</Link>
                  </Menu.Item>
                  <Menu.Item key="report-found-mob" icon={<PlusCircle size={16} style={{ color: claimGreen }} />}>
                    <Link to="/report/found" style={{ color: ink }}>Report Found</Link>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </div>

          <div style={{ paddingBottom: '16px' }}>
            {isAuthenticated ? (
              <Button
                danger
                type="primary"
                block
                icon={<LogOut size={16} />}
                onClick={handleLogout}
                style={{
                  borderRadius: 0,
                  backgroundColor: claimRed,
                  borderColor: claimRed,
                  fontFamily: monoFont,
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  height: '40px',
                  boxShadow: `2px 2px 0px ${ink}`,
                }}
              >
                Log Out
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <Button 
                    block 
                    style={{
                      borderRadius: 0,
                      backgroundColor: paperLight,
                      border: `1.5px solid ${ink}`,
                      color: ink,
                      fontFamily: monoFont,
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      height: '40px',
                    }}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <Button 
                    type="primary" 
                    block 
                    style={{
                      borderRadius: 0,
                      backgroundColor: ink,
                      borderColor: ink,
                      color: paperLight,
                      fontFamily: monoFont,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      height: '40px',
                      boxShadow: `2px 2px 0px ${brass}`,
                    }}
                  >
                    Register
                  </Button>
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

      {/* FOOTER SECTION */}
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: ink,
          backgroundImage: paperTexture,
          borderTop: `2px solid ${ink}`,
          padding: '28px 40px',
          color: paperDeep,
          fontFamily: bodyFont,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: paperLight, fontFamily: displayFont, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unstray</span>
            <span style={{ fontFamily: monoFont, fontSize: '12px', color: paperDeep }}>© 2026. Official Public Property Directory.</span>
          </div>
          <Space size="large" style={{ fontFamily: monoFont, fontSize: '12px', textTransform: 'uppercase' }}>
            <Link to="/items" style={{ color: paperLight }}>Search Directory</Link>
            <a href="#how" style={{ color: paperLight }}>How It Works</a>
            <a href="#about" style={{ color: paperLight }}>Privacy Protocol</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;