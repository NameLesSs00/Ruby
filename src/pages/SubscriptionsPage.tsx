import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, Plus, CreditCard, Coins, CheckCircle } from 'lucide-react';
import {
  subscriptionsApi,
  subscriptionKeys,
  type Subscription,
  type SubscriptionStatus,
  type PaymentStatus,
} from '../modules/subscriptions';
import { clientsApi } from '../modules/clients';
import { SubscriptionsTable } from '../components/subscriptions/SubscriptionsTable';
import { SubscriptionFormModal } from '../components/subscriptions/SubscriptionFormModal';
import { SubscriptionDeleteModal } from '../components/subscriptions/SubscriptionDeleteModal';
import { PaginationBar } from '../components/ui/PaginationBar';

function fmt(val: number) { return val.toLocaleString('ar-EG'); }

export const SubscriptionsPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filterClientId, setFilterClientId] = useState<number | ''>('');
  const [filterStatus, setFilterStatus] = useState<SubscriptionStatus | ''>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<PaymentStatus | ''>('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

  // 1. Fetch Subscriptions
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: subscriptionKeys.list({
      page,
      pageSize,
      clientId: filterClientId ? Number(filterClientId) : undefined,
      status: filterStatus || undefined,
      paymentStatus: filterPaymentStatus || undefined,
    }),
    queryFn: () =>
      subscriptionsApi.getAll({
        page,
        pageSize,
        clientId: filterClientId ? Number(filterClientId) : undefined,
        status: filterStatus || undefined,
        paymentStatus: filterPaymentStatus || undefined,
      }),
  });

  // 2. Fetch Clients for filter dropdown
  const { data: clientsData } = useQuery({
    queryKey: ['clients', 'filter-list'],
    queryFn: () => clientsApi.getAll({ page: 1, pageSize: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const subscriptions = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  // Compute live overview metrics
  const { totalPaid, totalRemaining, activeCount } = useMemo(() => {
    let paid = 0;
    let rem = 0;
    let act = 0;
    subscriptions.forEach((s) => {
      paid += s.paidAmount || 0;
      rem += s.remainingAmount || 0;
      if (s.status === 'Active') act += 1;
    });
    return { totalPaid: paid, totalRemaining: rem, activeCount: act };
  }, [subscriptions]);

  const handleOpenCreate = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsFormOpen(true);
  };

  const hasActiveFilters = Boolean(filterClientId || filterStatus || filterPaymentStatus);

  const resetFilters = () => {
    setFilterClientId('');
    setFilterStatus('');
    setFilterPaymentStatus('');
    setPage(1);
  };

  return (
    <div className="view-container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '10px',
            background: 'linear-gradient(135deg, #F37023, #FF6B22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <Ticket size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>إدارة الاشتراكات</h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>متابعة اشتراكات العملاء، الحصص المتبقية، والمدفوعات</p>
          </div>
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreate}>
          <Plus size={18} /><span>تسجيل اشتراك جديد</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          backgroundColor: '#fff', padding: '1rem 1.25rem', borderRadius: '10px',
          border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.85rem'
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '8px', backgroundColor: '#36C5F020',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7'
          }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>الاشتراكات النشطة</span>
            <strong style={{ fontSize: '1.2rem', color: '#0D1527' }}>{activeCount} اشتراك</strong>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff', padding: '1rem 1.25rem', borderRadius: '10px',
          border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.85rem'
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '8px', backgroundColor: '#10B98115',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981'
          }}>
            <Coins size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>إجمالي المحصل</span>
            <strong style={{ fontSize: '1.2rem', color: '#0D1527' }}>{fmt(totalPaid)} <span style={{ fontSize: '0.8rem' }}>ج.م</span></strong>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff', padding: '1rem 1.25rem', borderRadius: '10px',
          border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.85rem'
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '8px', backgroundColor: '#EF444415',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444'
          }}>
            <CreditCard size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>المبالغ المتبقية</span>
            <strong style={{ fontSize: '1.2rem', color: totalRemaining > 0 ? '#EF4444' : '#10B981' }}>
              {fmt(totalRemaining)} <span style={{ fontSize: '0.8rem' }}>ج.م</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="select-filter"
            value={filterClientId}
            onChange={(e) => { setFilterClientId(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
          >
            <option value="">جميع العملاء</option>
            {clientsData?.items.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </select>

          <select
            className="select-filter"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as SubscriptionStatus | ''); setPage(1); }}
          >
            <option value="">جميع حالات الاشتراك</option>
            <option value="Active">نشط</option>
            <option value="Completed">مكتمل</option>
            <option value="Expired">منتهي</option>
            <option value="Cancelled">ملغي</option>
          </select>

          <select
            className="select-filter"
            value={filterPaymentStatus}
            onChange={(e) => { setFilterPaymentStatus(e.target.value as PaymentStatus | ''); setPage(1); }}
          >
            <option value="">جميع حالات السداد</option>
            <option value="Paid">مدفوع بالكامل</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Unpaid">غير مدفوع</option>
          </select>

          {hasActiveFilters && (
            <button type="button" className="btn-secondary" onClick={resetFilters} style={{ padding: '0.5rem 1rem' }}>
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <SubscriptionsTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={(sub) => setDeletingSubscription(sub)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          label="إجمالي الاشتراكات"
          isLoading={isLoading}
          onPageChange={setPage}
        />
      )}

      {/* Form Modal */}
      <SubscriptionFormModal
        isOpen={isFormOpen}
        editingSubscription={editingSubscription}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { setIsFormOpen(false); refetch(); }}
      />

      {/* Delete Modal */}
      <SubscriptionDeleteModal
        subscription={deletingSubscription}
        onClose={() => setDeletingSubscription(null)}
        onSuccess={() => { setDeletingSubscription(null); refetch(); }}
      />
    </div>
  );
};

