import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getUserProfile } from '../../api/user';
import tuple from '../../utils/tuple';

export const UserProfile = () => {
  const router = useRouter();
  const { uid } = router.query;

  const username = uid as string;

  const { data } = useQuery(tuple(['getUserProfile', {
    username
  }]), () => getUserProfile({
    username
  }), {
    enabled: !!uid
  });

  return (
    <div>
      profile of { data?.email }
    </div>
  );
};

export default UserProfile;