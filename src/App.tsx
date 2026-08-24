import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Items from './pages/Items/Items';
import ItemDetails from './pages/ItemDetails/ItemDetails';
import CreateItem from './pages/CreateItem/CreateItem';
import EditItem from './pages/EditItem/EditItem';
import MyItems from './pages/MyItems/MyItems';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary brand / stamped ink
const inkSoft = "#4B5D67";   // secondary text
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / modal background
const claimRed = "#A23E2E";  // LOST tag / alert
const claimGreen = "#3E6C52"; // FOUND tag / success
const brass = "#A9884F";     // hardware accent / warning

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: ink,
          colorSuccess: claimGreen,
          colorWarning: brass,
          colorError: claimRed,
          colorBgContainer: paperLight,
          colorBgLayout: paper,
          colorText: ink,
          colorTextSecondary: inkSoft,
          borderRadius: 0,
          fontFamily: "'Inter', 'Work Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
          Card: {
            colorBgContainer: paperLight,
            borderRadiusLG: 0,
          },
          Button: {
            borderRadius: 0,
            borderRadiusSM: 0,
            borderRadiusLG: 0,
          },
          Input: {
            borderRadius: 0,
            colorBgContainer: paper,
          },
          Select: {
            borderRadius: 0,
            colorBgContainer: paper,
          },
          Modal: {
            contentBg: paperLight,
            borderRadiusLG: 0,
          },
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/lost" element={<Items />} />
              <Route path="/items/found" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetails />} />

              {/* Protected Routes */}
              <Route
                path="/report/lost"
                element={
                  <ProtectedRoute>
                    <CreateItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report/found"
                element={
                  <ProtectedRoute>
                    <CreateItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-items"
                element={
                  <ProtectedRoute>
                    <MyItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;