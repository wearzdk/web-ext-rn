import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function NotFoundScreen() {
  // auto redirect to home screen
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 0);
  }, []);
  return (
    <>
    </>
  );
}
