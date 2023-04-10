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
import { useRouter } from 'next/router';

export const AuthenticationContext = createContext<{
  user: Nullable<User>;
  isAuthenticated: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  error: string;
}>({
  isAuthenticated: false,
  initialized: false,
  user: null,
  error: '',
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
    const router = useRouter();
    const containsAuth = clientStorage.get<Auth>('auth') != null;
    const queryClient = useQueryClient();

    const [user, setUser] = useState<User>(initialUser);

    const { isFetched } = useQuery('getProfile', getProfile, {
        retry: false,
        enabled: containsAuth,
        onSuccess: (data) => {
          setUser(data.payload);
        },
        onError: (error: ApiError) => {
          if (error.status_code === 401) {
            clearAuth();
          }
        },
      },
    );

    const initialized = isFetched || !containsAuth;

    const { mutate: userLoginRequest, error } = useMutation(loginWithEmail, {
      onSuccess: async res => {
        const token = res.payload.access_token;
        const { exp, iat } = jwt_decode<JwtPayload>(token);

        setAuth({
          serverTime: res.metadata.server_time,
          expiresAt: exp ?? 0,
          issuedAt: iat ?? 0,
          token: token,
        });

        if(clientStorage.get('redirect') != null) {
          const url = clientStorage.get<string>('redirect') ?? "/";

          router.push(url);
          clientStorage.remove('redirect');
          return;
        } else{
          await router.push('/');
        }

        await queryClient.invalidateQueries('getProfile');
      },
    });

    const login = useCallback(async (email: string, password: string) => {
      return userLoginRequest({
        email,
        password,
      });
    }, [userLoginRequest]);

    const logout = useCallback(async () => {
      await router.push('/');
      clearAuth();
      setUser(initialUser);
      queryClient.clear();
    }, [queryClient, router]);

    return (
      <AuthenticationContext.Provider
        value={{
          isAuthenticated: user.id !== '',
          initialized,
          user: user,
          signIn: login,
          signOut: logout,
          error: error ?? (error as any),
        }}
      >
        {children}
      </AuthenticationContext.Provider>
    );
  }
;
;
