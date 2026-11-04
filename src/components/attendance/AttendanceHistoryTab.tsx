import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCheck, Layers, RefreshCw } from 'lucide-react';
import {
  attendanceApi,
  attendanceKeys,
  type AttendanceRecord,
} from '../../modules/attendance';
import { clientsApi } from '../../modules/clients';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { AttendanceRecordsTable } from './AttendanceRecordsTable';
import { EditAttendanceModal } from './EditAttendanceModal';
import { DeleteAttendanceModal } from './DeleteAttendanceModal';

export const AttendanceHistoryTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [selectedClient, setSelectedClient] = useState<SelectOption | null>(null);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals state
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<AttendanceRecord | null>(null);

  const queryParams = useMemo(
    () => ({
      clientId: selectedClient ? selectedClient.id : undefined,
      subscriptionId: subscriptionId ? parseInt(subscriptionId, 10) || undefined : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page,
      pageSize,
    }),
    [selectedClient, subscriptionId, fromDate, toDate, page, pageSize]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: attendanceKeys.list(queryParams),
    queryFn: () => attendanceApi.getAll(queryParams),
  });

  // Today's summary query
  const todayStr = new Date().toISOString().slice(0, 10);
  const { data: todayData } = useQuery({
    queryKey: attendanceKeys.list({ fromDate: todayStr, toDate: todayStr, page: 1, pageSize: 1 }),
    queryFn: () => attendanceApi.getAll({ fromDate: todayStr, toDate: todayStr, page: 1, pageSize: 1 }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const todayTotal = todayData?.totalCount ?? 0;

  const loadClients = async (query: string): Promise<SelectOption[]> => {
    const res = await clientsApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: `${c.fullName} (${c.clientCode})`,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مشترك',
    }));
  };

  const setDatePreset = (preset: 'today' | 'week' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const d = now.toISOString().slice(0, 10);
      setFromDate(d);
      setToDate(d);
    } else if (preset === 'week') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    } else {
      setFromDate('');
      setToDate('');
    }
    setPage(1);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <>
      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>حضور اليوم المسجل</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>
              {todayTotal} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>مشترك</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي القيود المطابقة للفلتر</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>قيد</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>فترة سريعة:</span>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('today')}
            >
              اليوم
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('week')}
            >
              آخر 7 أيام
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('all')}
            >
              الكل
            </button>
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            onClick={() => refetch()}
            title="تحديث البيانات"
          >
            <RefreshCw size={14} />
            <span>تحديث</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>فلترة بالمشترك</label>
            <AsyncSearchableSelect
              selectedItem={selectedClient}
              onChange={(val) => {
                setSelectedClient(val);
                setPage(1);
              }}
              loadOptions={loadClients}
              placeholder="ابحث باسم المشترك..."
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>رقم الاشتراك</label>
            <input
              type="number"
              className="form-input"
              placeholder="مثال: 12"
              value={subscriptionId}
              onChange={(e) => {
                setSubscriptionId(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>من تاريخ</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>إلى تاريخ</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <AttendanceRecordsTable
        items={rawItems}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onEdit={setEditingRecord}
        onDelete={setDeletingRecord}
      />

      {/* Modals */}
      <EditAttendanceModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
      />

      <DeleteAttendanceModal
        record={deletingRecord}
        onClose={() => setDeletingRecord(null)}
      />
    </>
  );
};
