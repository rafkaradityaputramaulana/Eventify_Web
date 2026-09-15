import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Ticket,
  QrCode,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { DashboardStats } from '../types';
import { eventifyApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fallbackActiveEventsCount, setFallbackActiveEventsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await eventifyApi.getDashboardStats();
      setStats(data);

      const rawActive = data?.active_events ?? (data as any)?.activeEvents ?? (data as any)?.active_events_count;
      
      if (!rawActive || rawActive === 0) {
        const eventsList: any[] = await eventifyApi.getEvents();
        if (Array.isArray(eventsList)) {
          const count = eventsList.filter((e: any) => {
            if (!e) return false;
            const status = String(e.status || e.status_id || '').toLowerCase();
            return (
              status === 'published' ||
              status === 'active' ||
              status === '1' ||
              e.is_active === true ||
              e.is_active === 1
            );
          }).length;
          setFallbackActiveEventsCount(count);
        }
      } else {
        setFallbackActiveEventsCount(rawActive);
      }
    } catch (e) {
      console.error('Failed fetching dashboard stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const displayActiveEvents =
    fallbackActiveEventsCount !== null
      ? fallbackActiveEventsCount
      : stats?.active_events || 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse font-jakarta">
        <div className="h-10 w-64 bg-neo-yellow/50 rounded-xl border-2 border-neo-dark" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border-3 border-neo-dark shadow-neo" />
          ))}
        </div>
      </div>
    );
  }

  const recentOrders = Array.isArray(stats?.recent_orders) ? stats!.recent_orders : [];
  const recentEvents = Array.isArray(stats?.recent_events) ? stats!.recent_events : [];

  return (
    <div className="space-y-8 font-jakarta">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl lg:text-3xl text-neo-dark tracking-tight">
            DASHBOARD OVERVIEW
          </h1>
          <p className="font-jakarta text-xs font-semibold text-gray-600 mt-1">
            Ringkasan performa platform & transaksi real-time Eventify
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={16} />}
          onClick={fetchStats}
        >
          Muat Ulang Data
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card bgColor="bg-neo-yellow" shadow="neo-lg" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space font-extrabold text-xs uppercase tracking-wider text-neo-dark">
              Event Aktif
            </span>
            <div className="p-2.5 bg-neo-dark text-neo-yellow rounded-xl border-2 border-neo-dark shadow-neo-sm">
              <CalendarCheck size={22} />
            </div>
          </div>
          <h3 className="font-space font-extrabold text-3xl text-neo-dark">
            {displayActiveEvents}
          </h3>
          <p className="font-jakarta text-xs font-bold text-neo-dark/80 mt-2 flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald-800" /> Published di mobile app
          </p>
        </Card>

        <Card bgColor="bg-neo-mint" shadow="neo-lg" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space font-extrabold text-xs uppercase tracking-wider text-neo-dark">
              Tiket Terjual
            </span>
            <div className="p-2.5 bg-neo-dark text-neo-mint rounded-xl border-2 border-neo-dark shadow-neo-sm">
              <Ticket size={22} />
            </div>
          </div>
          <h3 className="font-space font-extrabold text-3xl text-neo-dark">
            {(stats?.tickets_sold || 0).toLocaleString('id-ID')}
          </h3>
          <p className="font-jakarta text-xs font-bold text-neo-dark/80 mt-2 flex items-center gap-1">
            <ArrowUpRight size={14} className="text-emerald-800" /> Semua kategori tiket
          </p>
        </Card>

        <Card bgColor="bg-neo-toska" shadow="neo-lg" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space font-extrabold text-xs uppercase tracking-wider text-neo-dark">
              Kehadiran (Gate Scan)
            </span>
            <div className="p-2.5 bg-neo-dark text-neo-toska rounded-xl border-2 border-neo-dark shadow-neo-sm">
              <QrCode size={22} />
            </div>
          </div>
          <h3 className="font-space font-extrabold text-3xl text-neo-dark">
            {(stats?.gate_scans || 0).toLocaleString('id-ID')}
          </h3>
          <p className="font-jakarta text-xs font-bold text-neo-dark/80 mt-2 flex items-center gap-1">
            <CheckCircleIcon size={14} /> Presensi QR terverifikasi
          </p>
        </Card>

        <Card bgColor="bg-neo-pink" shadow="neo-lg" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space font-extrabold text-xs uppercase tracking-wider text-neo-dark">
              Total Revenue
            </span>
            <div className="p-2.5 bg-neo-dark text-neo-pink rounded-xl border-2 border-neo-dark shadow-neo-sm">
              <Wallet size={22} />
            </div>
          </div>
          <h3 className="font-space font-extrabold text-2xl lg:text-3xl text-neo-dark truncate">
            {formatRupiah(stats?.total_revenue || 0)}
          </h3>
          <p className="font-jakarta text-xs font-bold text-neo-dark/80 mt-2 flex items-center gap-1">
            ✨ Akumulasi Platform Gross
          </p>
        </Card>
      </div>

      {/* Transaction Volume Chart */}
      <Card className="shadow-neo-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-space font-extrabold text-lg text-neo-dark uppercase flex items-center gap-2">
              <TrendingUp size={20} /> Grafik Transaksi Harian
            </h3>
            <p className="font-jakarta text-xs text-gray-600 font-semibold">
              Volume akumulasi transaksi tiket dalam Rupiah (IDR)
            </p>
          </div>
          <Badge variant="yellow">MINGGU INI</Badge>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.daily_transactions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2630" opacity={0.15} />
              <XAxis
                dataKey="date"
                stroke="#2B2630"
                tick={{ fontStyle: 'Space Grotesk', fontWeight: 700 }}
              />
              <YAxis
                stroke="#2B2630"
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
                tick={{ fontStyle: 'Space Grotesk', fontWeight: 600, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF7FF',
                  border: '2.5px solid #2B2630',
                  borderRadius: '12px',
                  boxShadow: '4px 4px 0px 0px #2B2630',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 'bold',
                }}
                formatter={(val: any) => [formatRupiah(val), 'Pendapatan']}
              />
              <Bar
                dataKey="revenue"
                fill="#FFF176"
                stroke="#2B2630"
                strokeWidth={2.5}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-space font-extrabold text-base text-neo-dark uppercase flex items-center gap-2">
              ⚡ 5 Pesanan Terbaru
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/orders')}
            >
              Lihat Semua
            </Button>
          </div>

          <Table headers={['Kode Order', 'Pembeli', 'Total', 'Status']}>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center font-semibold text-xs text-gray-500">
                  Belum ada transaksi terbaru
                </td>
              </tr>
            ) : (
              recentOrders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-neo-yellow/20 transition-colors">
                  <td className="px-4 py-3 font-space font-bold text-xs text-neo-dark border-r-2 border-neo-dark">
                    {ord.order_code || '-'}
                  </td>
                  <td className="px-4 py-3 font-jakarta text-xs font-semibold text-neo-dark border-r-2 border-neo-dark">
                    {ord.user_name || 'Pembeli'}
                  </td>
                  <td className="px-4 py-3 font-space font-extrabold text-xs text-neo-dark border-r-2 border-neo-dark">
                    {formatRupiah(ord.total_amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        ord.status === 'paid'
                          ? 'mint'
                          : ord.status === 'pending'
                          ? 'yellow'
                          : 'pink'
                      }
                    >
                      {(ord.status || 'PENDING').toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-space font-extrabold text-base text-neo-dark uppercase flex items-center gap-2">
              🎉 5 Event Terbaru
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/events')}
            >
              Kelola Event
            </Button>
          </div>

          <Table headers={['Event', 'Kategori', 'Terjual', 'Status']}>
            {recentEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center font-semibold text-xs text-gray-500">
                  Belum ada event terdaftar
                </td>
              </tr>
            ) : (
              recentEvents.map((evt: any) => {
                const st = String(evt.status || '').toLowerCase();
                return (
                  <tr key={evt.id} className="hover:bg-neo-mint/20 transition-colors">
                    <td className="px-4 py-3 font-jakarta text-xs font-bold text-neo-dark border-r-2 border-neo-dark flex items-center gap-2">
                      <img
                        src={evt.poster_url || 'https://via.placeholder.com/150'}
                        alt={evt.title || ''}
                        className="w-7 h-7 rounded border border-neo-dark object-cover shrink-0"
                      />
                      <span className="truncate max-w-[140px]">{evt.title || 'Event'}</span>
                    </td>
                    <td className="px-4 py-3 font-space text-xs font-semibold text-neo-dark border-r-2 border-neo-dark">
                      {evt.category || 'Umum'}
                    </td>
                    <td className="px-4 py-3 font-space font-extrabold text-xs text-neo-dark border-r-2 border-neo-dark">
                      {evt.sold_tickets || 0}/{evt.total_quota || 0}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          st === 'published' || st === 'active' || st === '1'
                            ? 'mint'
                            : st === 'draft'
                            ? 'yellow'
                            : 'pink'
                        }
                      >
                        {(evt.status || 'DRAFT').toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

function CheckCircleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}