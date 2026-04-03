import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center font-['Lora',serif] italic text-[#4A3728]">Breathing in...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return React.cloneElement(children, { firebaseUser: user });
};

export default ProtectedRoute;
