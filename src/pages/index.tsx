import { useAuthentication } from '../contexts/AuthenticationContext';
import Landing from '../containers/landing';
import { useRouter } from 'next/router';
import Dashboard from '../containers/Dashboard';

export default function Home() {
  const auth = useAuthentication();

  // if(!auth.initialized) {
  //   return <></>
  // }

  if (auth.isAuthenticated) {
    return <>
      <Dashboard />
    </>;
  }

  return <Landing />;
}
