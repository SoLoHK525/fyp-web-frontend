/**
 * React create context hook
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Nullable } from '../types/utils';
import { getProfile, loginWithEmail, User } from '../api/auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Auth } from '../types/Auth';
import { clientStorage } from '../utils/client-storage';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { ApiError } from '../api/_base';

export const AuthenticationContext = createContext<{
  user: Nullable<User>;
  isAuthenticated: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}>({
  isAuthenticated: false,
  initialized: false,
  user: null,
  signIn: async (_, __) => {
    return null;
  },
  signOut: async () => {
  },
});

export const useAuthentication = () => useContext(AuthenticationContext);

const setAuth = (auth: Auth) => {
  clientStorage.set('auth', auth);
};

const clearAuth = () => {
  clientStorage.remove('auth');
};

const initialUser: User = {
  id: '',
  email: '',
};


export const AuthenticationProvider = ({ children }: any) => {
    const containsAuth = clientStorage.get<Auth>('auth') != null;
    const queryClient = useQueryClient();

    const [user, setUser] = useState<User>(initialUser);

    const { isFetched } = useQuery('getProfile', getProfile, {
        retry: false,
        enabled: containsAuth,
        onSuccess: (user) => {
          setUser(user);
        },
        onError: (error: ApiError) => {
          if (error.error_code === 'unauthorized') {
            clearAuth();
          }
        },
      },
    );

    const initialized = isFetched || !containsAuth;

    const { mutate: userLoginRequest } = useMutation(loginWithEmail, {
      onSuccess: async res => {
        const token = res.access_token;
        const { exp, iat } = jwt_decode<JwtPayload>(token);

        setAuth({
          serverTime: res.metadata.server_time,
          expiresAt: exp ?? 0,
          issuedAt: iat ?? 0,
          token: token,
        });
      },
      onError(err) {
        console.error(err);
      },
    });

    const login = useCallback((email: string, password: string) => {
      return userLoginRequest({
        email,
        password,
      });
    }, [userLoginRequest]);

    const logout = useCallback(() => {
      clearAuth();
      setUser(initialUser);
      queryClient.clear();
    }, [queryClient]);

    return (
      <AuthenticationContext.Provider
        value={{
          isAuthenticated: user.id !== '',
          initialized,
          user: user,
          signIn: login,
          signOut: logout,
        }}
      >
        {children}
      </AuthenticationContext.Provider>
    );
  }
;
;
