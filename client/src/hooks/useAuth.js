import { useSelector } from 'react-redux';

export default function useAuth() {
  const { token, user } = useSelector(s => s.user);
  return { token, user, isLoggedIn: !!token };
}


 