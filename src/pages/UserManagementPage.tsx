import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, UserCheck, Crown } from 'lucide-react';
import type { User, UserRole } from '../types';
import { eventifyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { UserAvatar } from '../components/ui/UserAvatar';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // State modal ubah role
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('customer');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const { updateUserRoleState } = useAuth();

  // Helper konversi ID role / string dari backend ke format standar frontend
  const getRoleString = (usr: any): UserRole => {
    if (!usr) return 'customer';
    const raw = usr.role_id ?? usr.role ?? usr.id_role;

    if (raw === 1 || raw === '1' || String(raw).toLowerCase() === 'admin') return 'admin';
    if (
      raw === 2 ||
      raw === '2' ||
      String(raw).toLowerCase() === 'organizer' ||
      String(raw).toLowerCase() === 'panitia'
    ) {
      return 'organizer';
    }
    return 'customer'; // Default untuk ID 3 atau nilai lainnya
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await eventifyApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Gagal mengambil data user:', e);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(getRoleString(user));
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setIsUpdatingRole(true);

    try {
      // Mengirim string role ('admin' | 'organizer' | 'customer') sesuai ekspektasi service API
      await eventifyApi.updateUserRole(selectedUser.id, newRole);

      if (typeof updateUserRoleState === 'function') {
        updateUserRoleState(selectedUser.id, newRole);
      }

      await fetchUsers(); // Re-fetch data terbaru dari database
      setShowRoleModal(false);
    } catch (e: any) {
      console.error('Gagal memperbarui role user:', e?.response?.data || e);
      const errorMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Gagal memperbarui role. Pastikan token admin masih valid.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((usr) => {
    if (!usr) return false;

    const query = searchQuery.toLowerCase();
    const name = (usr.name || '').toLowerCase();
    const email = (usr.email || '').toLowerCase();
    const phone = usr.phone || (usr as any).phone_number || '';

    const matchesSearch =
      name.includes(query) ||
      email.includes(query) ||
      phone.includes(query);

    const userRole = getRoleString(usr);
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-jakarta">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl lg:text-3xl text-neo-dark tracking-tight flex items-center gap-3">
            <Users size={32} className="text-neo-dark" /> KELOLA USER & HAK AKSES
          </h1>
          <p className="font-jakarta text-xs font-semibold text-gray-600 mt-1">
            Manajemen direktori pengguna terdaftar & pengaturan role (Customer, Panitia, Admin)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="yellow">TOTAL {safeUsers.length} PENGGUNA</Badge>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-white rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Cari nama, email, atau telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="font-space font-extrabold text-xs uppercase text-neo-dark shrink-0 flex items-center gap-1">
            <Filter size={14} /> Role:
          </span>
          {[
            { id: 'all', label: 'Semua Role' },
            { id: 'admin', label: 'Admin' },
            { id: 'organizer', label: 'Panitia' },
            { id: 'customer', label: 'Customer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg border-2 border-neo-dark font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-neo-mint shadow-neo-sm text-neo-dark translate-y-[-1px]'
                  : 'bg-white hover:bg-neo-gray text-neo-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-xl border-3 border-neo-dark shadow-neo font-space font-extrabold animate-pulse">
          Memuat Direktori User...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border-3 border-neo-dark shadow-neo">
          <Users size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="font-space font-extrabold text-lg text-neo-dark">
            Tidak ada pengguna yang cocok
          </h3>
          <p className="font-jakarta text-xs text-gray-500 mt-1">
            Silakan ubah filter role atau pencarian kata kunci.
          </p>
        </div>
      ) : (
        <Table
          headers={[
            'Profil Pengguna',
            'Kontak / Email',
            'Role Hak Akses',
            'Tanggal Registrasi',
            'Aksi Ubah Role',
          ]}
        >
          {filteredUsers.map((usr) => {
            const userRole = getRoleString(usr);

            return (
              <tr key={usr.id} className="hover:bg-neo-mint/15 transition-colors">
                {/* Profil Pengguna Initials Avatar */}
                <td className="px-4 py-3 font-jakarta text-xs font-bold text-neo-dark border-r-2 border-neo-dark">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={usr.name || 'User'} role={userRole} size="md" />
                    <div>
                      <h4 className="font-space font-bold text-xs text-neo-dark">
                        {usr.name || 'Tanpa Nama'}
                      </h4>
                      <span className="font-jakarta text-[10px] text-gray-500 font-semibold">
                        ID: {usr.id || '-'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Kontak / Email */}
                <td className="px-4 py-3 font-jakarta text-xs text-neo-dark border-r-2 border-neo-dark">
                  <p className="font-semibold">{usr.email || '-'}</p>
                  <span className="text-[11px] text-gray-500 font-bold">
                    📱 {usr.phone || (usr as any).phone_number || '-'}
                  </span>
                </td>

                {/* Role Badge */}
                <td className="px-4 py-3 border-r-2 border-neo-dark">
                  <Badge
                    variant={
                      userRole === 'admin'
                        ? 'pink'
                        : userRole === 'organizer'
                        ? 'yellow'
                        : 'mint'
                    }
                    icon={
                      userRole === 'admin' ? (
                        <Crown size={14} />
                      ) : userRole === 'organizer' ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <UserCheck size={14} />
                      )
                    }
                  >
                    {userRole === 'organizer' ? 'PANITIA' : userRole.toUpperCase()}
                  </Badge>
                </td>

                {/* Tanggal Registrasi */}
                <td className="px-4 py-3 font-space text-xs font-semibold text-neo-dark border-r-2 border-neo-dark whitespace-nowrap">
                  {usr.created_at || (usr as any).createdAt
                    ? new Date(usr.created_at || (usr as any).createdAt).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )
                    : '-'}
                </td>

                {/* Aksi Ubah Role */}
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenRoleModal(usr)}
                  >
                    Ubah Role
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      )}

      {/* Change Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={`Ubah Role Pengguna: ${selectedUser?.name || ''}`}
        maxWidth="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-3.5 bg-neo-yellow/30 rounded-xl border-2 border-neo-dark flex items-center gap-3">
              <UserAvatar
                name={selectedUser.name || 'User'}
                role={getRoleString(selectedUser)}
                size="lg"
              />
              <div>
                <h4 className="font-space font-extrabold text-sm text-neo-dark">
                  {selectedUser.name || 'Tanpa Nama'}
                </h4>
                <p className="font-jakarta text-xs text-gray-600 font-semibold">
                  {selectedUser.email || '-'}
                </p>
                <div className="mt-1">
                  <Badge variant="yellow">
                    ROLE SAAT INI:{' '}
                    {getRoleString(selectedUser) === 'organizer'
                      ? 'PANITIA'
                      : getRoleString(selectedUser).toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <Select
              label="Pilih Role Hak Akses Baru"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              options={[
                { value: 'customer', label: '👤 Customer (Peserta biasa)' },
                { value: 'organizer', label: '🎪 Panitia / Organizer (Penyelenggara)' },
                { value: 'admin', label: '👑 Administrator (Akses Penuh Portal)' },
              ]}
            />

            <div className="p-3 bg-neo-pink/20 rounded-xl border-2 border-neo-dark font-jakarta text-xs font-semibold text-neo-dark">
              ⚠️ <strong>Perhatian:</strong> Mengubah role pengguna akan langsung mempengaruhi hak
              akses mereka di platform.
            </div>

            <div className="pt-4 border-t-2 border-neo-dark flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowRoleModal(false)}
                disabled={isUpdatingRole}
              >
                Batal
              </Button>
              <Button
                variant="mint"
                onClick={handleSaveRole}
                isLoading={isUpdatingRole}
              >
                Simpan Perubahan Role
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};