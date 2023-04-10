import { useAuthentication } from '../../contexts/AuthenticationContext';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import { clientStorage } from '../../utils/client-storage';

const ProtectedContent = ({ children }: PropsWithChildren) => {
  const auth = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (auth.initialized && !auth.isAuthenticated) {
      clientStorage.set('redirect', router.asPath);
      router.push('/login');
    }
  }, [auth.initialized, auth.isAuthenticated, router]);

  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  return <></>;
}

export default ProtectedContent;