import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Coins, CheckCircle, QrCode } from 'lucide-react';
import {
  subscriptionsApi,
  subscriptionKeys,
  type Subscription,
  type SubscriptionStatus,
  type PaymentStatus,
} from '../../modules/subscriptions';
import { clientsApi, clientKeys } from '../../modules/clients';
import { SubscriptionsTable } from './SubscriptionsTable';
import { PaginationBar } from '../ui/PaginationBar';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';

interface SubscriptionsListTabProps {
  onEdit: (sub: Subscription) => void;
  onDelete: (sub: Subscription) => void;
  onRecordPayment: (sub: Subscription) => void;
  onManageAssignments: (sub: Subscription) => void;
  onCancelSubscription: (sub: Subscription) => void;
}

function fmt(val: number) {
  return val.toLocaleString('ar-EG');
}

export const SubscriptionsListTab = ({
  onEdit,
  onDelete,
  onRecordPayment,
  onManageAssignments,
  onCancelSubscription,
}: SubscriptionsListTabProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filterClient, setFilterClient] = useState<SelectOption | null>(null);
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<SubscriptionStatus | ''>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<PaymentStatus | ''>('');

  const filterClientId = filterClient ? filterClient.id : undefined;
  const activeBarcode = barcodeQuery.trim();

  // If a barcode is entered, fetch via client subscriptions endpoint
  const {
    data: barcodeData,
    isLoading: isBarcodeLoading,
    isError: isBarcodeError,
  } = useQuery({
    queryKey: clientKeys.subscriptions({
      barcode: activeBarcode,
      subscriptionStatus: filterStatus || undefined,
      page,
      pageSize,
    }),
    queryFn: () =>
      clientsApi.getSubscriptions({
        barcode: activeBarcode,
        subscriptionStatus: filterStatus || undefined,
        page,
        pageSize,
      }),
    enabled: Boolean(activeBarcode),
  });

  // Standard subscriptions query when not filtering by barcode
  const {
    data: standardData,
    isLoading: isStandardLoading,
    isError: isStandardError,
  } = useQuery({
    queryKey: subscriptionKeys.list({
      page,
      pageSize,
      clientId: filterClientId,
      status: filterStatus || undefined,
      paymentStatus: filterPaymentStatus || undefined,
    }),
    queryFn: () =>
      subscriptionsApi.getAll({
        page,
        pageSize,
        clientId: filterClientId,
        status: filterStatus || undefined,
        paymentStatus: filterPaymentStatus || undefined,
      }),
    enabled: !activeBarcode,
  });

  const data = activeBarcode ? barcodeData : standardData;
  const isLoading = activeBarcode ? isBarcodeLoading : isStandardLoading;
  const isError = activeBarcode ? isBarcodeError : isStandardError;

  const subscriptions = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

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

  const loadFilterClients = async (query: string): Promise<SelectOption[]> => {
    const res = await clientsApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: c.phoneNumber ? `هاتف: ${c.phoneNumber}` : undefined,
      tag: c.barcode ? `باركود: ${c.barcode}` : undefined,
    }));
  };

  const hasActiveFilters = Boolean(
    filterClient || barcodeQuery || filterStatus || filterPaymentStatus
  );

  const resetFilters = () => {
    setFilterClient(null);
    setBarcodeQuery('');
    setFilterStatus('');
    setFilterPaymentStatus('');
    setPage(1);
  };

  return (
    <>
      {/* KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '8px',
              backgroundColor: '#36C5F020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284C7',
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>
              الاشتراكات النشطة
            </span>
            <strong style={{ fontSize: '1.2rem', color: '#0D1527' }}>{activeCount} اشتراك</strong>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '8px',
              backgroundColor: '#10B98115',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Coins size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>
              إجمالي المحصل
            </span>
            <strong style={{ fontSize: '1.2rem', color: '#0D1527' }}>
              {fmt(totalPaid)} <span style={{ fontSize: '0.8rem' }}>ج.م</span>
            </strong>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '8px',
              backgroundColor: '#EF444415',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
            }}
          >
            <CreditCard size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>
              المبالغ المتبقية
            </span>
            <strong style={{ fontSize: '1.2rem', color: totalRemaining > 0 ? '#EF4444' : '#10B981' }}>
              {fmt(totalRemaining)} <span style={{ fontSize: '0.8rem' }}>ج.م</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          {/* Barcode Search / Scan Input */}
          <div style={{ position: 'relative', minWidth: 200, maxWidth: 260, flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="البحث بالباركود..."
              value={barcodeQuery}
              onChange={(e) => {
                setBarcodeQuery(e.target.value);
                if (e.target.value) setFilterClient(null);
                setPage(1);
              }}
              dir="ltr"
              style={{ textAlign: 'start', paddingInlineEnd: '2.4rem' }}
            />
            <QrCode
              size={16}
              style={{
                position: 'absolute',
                insetInlineEnd: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
          </div>

          <AsyncSearchableSelect
            placeholder="تصفية حسب العميل (الاسم أو الهاتف)..."
            selectedItem={filterClient}
            onChange={(c) => {
              setFilterClient(c);
              if (c) setBarcodeQuery('');
              setPage(1);
            }}
            loadOptions={loadFilterClients}
            disabled={Boolean(activeBarcode)}
            className=""
            style={{ minWidth: 240, maxWidth: 340, margin: 0, flex: 1 }}
          />

          <select
            className="select-filter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as SubscriptionStatus | '');
              setPage(1);
            }}
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
            onChange={(e) => {
              setFilterPaymentStatus(e.target.value as PaymentStatus | '');
              setPage(1);
            }}
          >
            <option value="">جميع حالات السداد</option>
            <option value="Paid">مدفوع بالكامل</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Unpaid">غير مدفوع</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetFilters}
              style={{ padding: '0.5rem 1rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      <SubscriptionsTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        isError={isError}
        onEdit={onEdit}
        onDelete={onDelete}
        onRecordPayment={onRecordPayment}
        onManageAssignments={onManageAssignments}
        onCancelSubscription={onCancelSubscription}
      />

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
    </>
  );
};

