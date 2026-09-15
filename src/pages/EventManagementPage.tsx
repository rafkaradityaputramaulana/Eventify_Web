import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  PauseCircle,
  Ticket,
  MapPin,
} from 'lucide-react';
import type { EventItem, EventStatus } from '../types';
import { eventifyApi } from '../services/api';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Selected event for detail tier modal
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);

  // Event to delete
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventifyApi.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed fetching events', e);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    try {
      const updated = await eventifyApi.updateEventStatus(eventId, newStatus);
      if (updated) {
        setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updated } : e)));
      }
    } catch (e) {
      console.error('Failed updating event status', e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      await eventifyApi.deleteEvent(eventToDelete.id);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (e) {
      console.error('Failed deleting event', e);
    }
  };

  // Safe Filtering
  const safeEvents = Array.isArray(events) ? events : [];
  const filteredEvents = safeEvents.filter((evt) => {
    if (!evt) return false;

    const query = (searchQuery || '').toLowerCase();
    const title = (evt.title || '').toLowerCase();
    const organizer = (evt.organizer_name || '').toLowerCase();
    const category = (evt.category || '').toLowerCase();
    const status = (evt.status || '').toLowerCase();

    const matchesSearch =
      title.includes(query) ||
      organizer.includes(query) ||
      category.includes(query);

    const matchesStatus =
      statusFilter === 'all' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (amount?: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6 font-jakarta">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl lg:text-3xl text-neo-dark tracking-tight flex items-center gap-3">
            <Calendar size={32} className="text-neo-dark" /> KELOLA SEMUA EVENT
          </h1>
          <p className="font-jakarta text-xs font-semibold text-gray-600 mt-1">
            Modifikasi status publikasi, tinjau kuota tiket tier, atau hapus event platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="mint">TOTAL {safeEvents.length} EVENT</Badge>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-white rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Cari judul, kategori, penyelenggara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="font-space font-extrabold text-xs uppercase text-neo-dark shrink-0 flex items-center gap-1">
            <Filter size={14} /> Filter Status:
          </span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'published', label: 'Published' },
            { id: 'draft', label: 'Draft' },
            { id: 'ended', label: 'Ended' },
            { id: 'suspended', label: 'Suspended' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg border-2 border-neo-dark font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-neo-yellow shadow-neo-sm text-neo-dark translate-y-[-1px]'
                  : 'bg-white hover:bg-neo-gray text-neo-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-xl border-3 border-neo-dark shadow-neo font-space font-extrabold animate-pulse">
          Memuat Daftar Event...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border-3 border-neo-dark shadow-neo">
          <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="font-space font-extrabold text-lg text-neo-dark">
            Tidak ada event yang ditemukan
          </h3>
          <p className="font-jakarta text-xs text-gray-500 mt-1">
            Coba ubah kata kunci pencarian atau filter status event.
          </p>
        </div>
      ) : (
        <Table
          headers={[
            'Poster & Judul',
            'Kategori',
            'Penyelenggara',
            'Lokasi & Waktu',
            'Penjualan Tiket',
            'Status',
            'Aksi Admin',
          ]}
        >
          {filteredEvents.map((evt) => {
            const soldTickets = evt.sold_tickets || 0;
            const totalQuota = evt.total_quota || 1;
            const percentage = Math.min(100, Math.round((soldTickets / totalQuota) * 100));

            return (
              <tr key={evt.id || Math.random()} className="hover:bg-neo-yellow/15 transition-colors">
                {/* Poster & Judul */}
                <td className="px-4 py-3 font-jakarta text-xs font-bold text-neo-dark border-r-2 border-neo-dark max-w-[220px]">
                  <div className="flex items-center gap-3">
                    <img
                      src={evt.poster_url || 'https://via.placeholder.com/150'}
                      alt={evt.title || 'Event'}
                      className="w-12 h-12 rounded-lg border-2 border-neo-dark object-cover shrink-0 shadow-neo-sm"
                    />
                    <div>
                      <h4 className="font-space font-bold text-xs text-neo-dark line-clamp-2">
                        {evt.title || 'Tanpa Judul'}
                      </h4>
                      <span className="font-jakarta text-[10px] text-gray-500 font-semibold">
                        ID: {evt.id || '-'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Kategori */}
                <td className="px-4 py-3 border-r-2 border-neo-dark">
                  <Badge variant="purple">{evt.category || 'Umum'}</Badge>
                </td>

                {/* Penyelenggara */}
                <td className="px-4 py-3 font-jakarta text-xs font-bold text-neo-dark border-r-2 border-neo-dark">
                  {evt.organizer_name || '-'}
                </td>

                {/* Lokasi & Waktu */}
                <td className="px-4 py-3 font-jakarta text-xs text-neo-dark border-r-2 border-neo-dark">
                  <p className="font-bold flex items-center gap-1">
                    <MapPin size={12} className="text-neo-pink shrink-0" />
                    <span className="truncate max-w-[130px]">{evt.location || '-'}</span>
                  </p>
                  <span className="text-[11px] text-gray-600 block mt-0.5 font-semibold">
                    {evt.start_date
                      ? new Date(evt.start_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '-'}
                  </span>
                </td>

                {/* Penjualan Tiket Progress */}
                <td className="px-4 py-3 border-r-2 border-neo-dark">
                  <div className="w-32">
                    <div className="flex justify-between text-[11px] font-space font-extrabold text-neo-dark mb-1">
                      <span>{soldTickets} sold</span>
                      <span>{evt.total_quota || 0} max</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full border-1.5 border-neo-dark overflow-hidden">
                      <div
                        className="h-full bg-neo-yellow border-r border-neo-dark"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3 border-r-2 border-neo-dark">
                  <Badge
                    variant={
                      evt.status === 'published'
                        ? 'mint'
                        : evt.status === 'draft'
                        ? 'yellow'
                        : evt.status === 'ended'
                        ? 'gray'
                        : 'pink'
                    }
                  >
                    {(evt.status || 'draft').toUpperCase()}
                  </Badge>
                </td>

                {/* Aksi Admin */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {evt.status !== 'published' ? (
                      <Button
                        variant="mint"
                        size="sm"
                        icon={<CheckCircle size={14} />}
                        onClick={() => handleStatusChange(evt.id, 'published')}
                        title="Publish Event Ke Mobile"
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<XCircle size={14} />}
                        onClick={() => handleStatusChange(evt.id, 'draft')}
                        title="Ubah ke Draft (Unpublish)"
                      >
                        Draft
                      </Button>
                    )}

                    {evt.status !== 'suspended' && (
                      <button
                        onClick={() => handleStatusChange(evt.id, 'suspended')}
                        className="p-1.5 bg-neo-orange rounded-lg border-2 border-neo-dark hover:bg-orange-300 transition-all cursor-pointer shadow-neo-sm"
                        title="Suspend / Bekukan Event"
                      >
                        <PauseCircle size={16} />
                      </button>
                    )}

                    {/* Detail Tier Button */}
                    <button
                      onClick={() => {
                        setSelectedEvent(evt);
                        setShowTierModal(true);
                      }}
                      className="p-1.5 bg-neo-toska rounded-lg border-2 border-neo-dark hover:bg-teal-200 transition-all cursor-pointer shadow-neo-sm"
                      title="Detail Tier Tiket & Kuota"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Delete Event Button */}
                    <button
                      onClick={() => setEventToDelete(evt)}
                      className="p-1.5 bg-neo-pink rounded-lg border-2 border-neo-dark hover:bg-pink-300 transition-all cursor-pointer shadow-neo-sm text-neo-dark"
                      title="Hapus Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}

      {/* Ticket Tier Detail Modal */}
      <Modal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        title={`Rincian Tiket Tier: ${selectedEvent?.title || ''}`}
        maxWidth="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="p-3 bg-neo-yellow/30 rounded-xl border-2 border-neo-dark flex items-center justify-between">
              <span className="font-space font-extrabold text-xs text-neo-dark uppercase">
                Total Akumulasi Kuota Event
              </span>
              <Badge variant="yellow">
                {selectedEvent.sold_tickets || 0} / {selectedEvent.total_quota || 0} Tiket Terjual
              </Badge>
            </div>

            <h4 className="font-space font-extrabold text-sm uppercase text-neo-dark flex items-center gap-1.5">
              <Ticket size={18} /> Rincian Kategori Tier Tiket
            </h4>

            <div className="space-y-3">
              {(selectedEvent.ticket_tiers || []).length === 0 ? (
                <p className="text-xs text-gray-500 italic p-3 text-center">
                  Belum ada kategori tier tiket untuk event ini.
                </p>
              ) : (
                (selectedEvent.ticket_tiers || []).map((tier) => {
                  const sold = tier.sold || 0;
                  const quota = tier.quota || 1;
                  const tierPercentage = Math.min(100, Math.round((sold / quota) * 100));

                  return (
                    <div
                      key={tier.id || Math.random()}
                      className="p-4 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h5 className="font-space font-extrabold text-sm text-neo-dark">
                          {tier.name || 'Tier Regular'}
                        </h5>
                        {tier.description && (
                          <p className="font-jakarta text-xs text-gray-600 font-semibold mt-0.5">
                            {tier.description}
                          </p>
                        )}
                        <span className="inline-block mt-2 font-space font-extrabold text-sm text-emerald-800 bg-neo-mint px-2 py-0.5 rounded border border-neo-dark">
                          {formatRupiah(tier.price)}
                        </span>
                      </div>

                      <div className="text-right sm:text-right">
                        <div className="font-space font-extrabold text-xs text-neo-dark">
                          Terjual: {sold} / {tier.quota || 0}
                        </div>
                        <div className="w-36 h-3 bg-gray-200 rounded-full border-1.5 border-neo-dark mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-neo-pink"
                            style={{ width: `${tierPercentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 block mt-1">
                          Sisa Kuota: {(tier.quota || 0) - sold} Tiket
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t-2 border-neo-dark flex justify-end">
              <Button variant="secondary" onClick={() => setShowTierModal(false)}>
                Tutup Preview Tier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Event Confirmation Modal */}
      <ConfirmModal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Event Ini?"
        message={`Apakah Anda yakin ingin menghapus event "${eventToDelete?.title || ''}" secara permanen dari platform?`}
        confirmText="Ya, Hapus Event"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
};