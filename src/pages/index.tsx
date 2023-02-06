import { useAuthentication } from '../contexts/AuthenticationContext';
import Landing from '../containers/landing';

export default function Home() {
  const auth = useAuthentication();

  if(!auth.initialized) {
    return <></>
  }

  if(!auth.isAuthenticated) {
    return <Landing />
  }

  return (
    <>
      Welcome! { auth.user?.email }
      <button onClick={auth.signOut}>Sign Out</button>
    </>
  );
}
