import { useSession } from 'next-auth/react';

const useCurrentUser = () => {
    const session = useSession()
    if (session.status === "authenticated") {
      return session.data?.user
    } else {
      return null
    }
}

export default useCurrentUser