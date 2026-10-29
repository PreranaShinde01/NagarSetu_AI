import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, ROLES, hasPermission, ROLE_DEFINITIONS } from '../config/rbacConfig';
import { authService } from '../services/api/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return DEMO_USERS.find((u) => u.role === ROLES.NAGARSETU_CONTROLLER) || DEMO_USERS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  // Attempt token initialization from REST API
  useEffect(() => {
    const token = localStorage.getItem('nagarsetu_auth_token');
    if (token) {
      authService.getMe()
        .then((res) => {
          if (res.data?.user) {
            setCurrentUser(res.data.user);
            setIsAuthenticated(true);
            setApiUnavailable(false);
          }
        })
        .catch((err) => {
          if (err?.isApiUnavailable) {
            setApiUnavailable(true);
          }
        });
    }
  }, []);

  const loginAsRole = async (role) => {
    const demoUser = DEMO_USERS.find((u) => u.role === role);
    if (demoUser) {
      try {
        const res = await authService.login(demoUser.email, 'Demo@1234');
        if (res.data?.token) {
          localStorage.setItem('nagarsetu_auth_token', res.data.token);
          setCurrentUser(res.data.user);
          setIsAuthenticated(true);
          setApiUnavailable(false);
          return true;
        }
      } catch (err) {
        if (err?.isApiUnavailable) {
          setApiUnavailable(true);
        }
        // Fallback local demo profile for offline UI exploration
        setCurrentUser(demoUser);
        setIsAuthenticated(true);
      }
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.data?.token) {
        localStorage.setItem('nagarsetu_auth_token', res.data.token);
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
        setApiUnavailable(false);
        return { success: true };
      }
    } catch (err) {
      if (err?.isApiUnavailable) {
        setApiUnavailable(true);
      }
      // Demo fallback lookup
      const found = DEMO_USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || DEMO_USERS[0];
      setCurrentUser(found);
      setIsAuthenticated(true);
      return { success: true, offline: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('nagarsetu_auth_token');
    setIsAuthenticated(false);
  };

  const checkPermission = (permission) => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  };

  const currentRoleDef = ROLE_DEFINITIONS.find((r) => r.role === currentUser?.role) || ROLE_DEFINITIONS[0];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        apiUnavailable,
        loginAsRole,
        loginUser,
        logout,
        checkPermission,
        currentRoleDef,
        demoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
