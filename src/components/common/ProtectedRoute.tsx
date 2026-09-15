import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-neo-bg flex items-center justify-center">
        <div className="p-6 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo text-center">
          <p className="font-space font-extrabold text-lg text-neo-dark animate-pulse">
            Memuat Hak Akses Admin...
          </p>
        </div>
      </div>
    );
  }

  // Cast ke 'any' untuk keamanan pengecekan tipe data role
  const userData = user as any;
  const rawRole = userData?.role ?? userData?.role_id ?? userData?.id_role;

  const isAdmin =
    rawRole === 1 ||
    rawRole === '1' ||
    String(rawRole ?? '').toLowerCase() === 'admin';

  // Jika tidak terautentikasi / user null / bukan admin -> Wajib tendang ke /login
  if (!isAuthenticated || !user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};