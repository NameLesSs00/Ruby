import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Ticket, QrCode, User, AlertCircle, Phone, Calendar } from 'lucide-react';
import { clientsApi, clientKeys, type Client } from '../../modules/clients';
import {
  subscriptionsApi,
  subscriptionKeys,
  type SubscriptionStatus,
  subscriptionTypeLabel,
  subscriptionStatusLabel,
  subscriptionStatusBadgeClass,
  paymentStatusLabel,
  paymentStatusBadgeClass,
} from '../../modules/subscriptions';
import { useModalEscape } from '../../lib/useModalEscape';

interface ClientSubscriptionsModalProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientSubscriptionsModal = ({
  client,
  onClose,
}: ClientSubscriptionsModalProps) => {
  useModalEscape(onClose, Boolean(client));
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const hasBarcode = Boolean(client?.barcode);

  // If client has barcode, use the new /api/clients/subscriptions endpoint
  const barcodeQuery = useQuery({
    queryKey: clientKeys.subscriptions({
      barcode: client?.barcode || undefined,
      subscriptionStatus: statusFilter || undefined,
      page,
      pageSize,
    }),
    queryFn: () =>
      clientsApi.getSubscriptions({
        barcode: client!.barcode!,
        subscriptionStatus: statusFilter || undefined,
        page,
        pageSize,
      }),
    enabled: Boolean(client && hasBarcode),
  });

  // Fallback to /api/subscriptions?ClientId=... if client doesn't have a barcode
  const clientIdQuery = useQuery({
    queryKey: subscriptionKeys.list({
      clientId: client?.id,
      status: statusFilter || undefined,
      page,
      pageSize,
    }),
    queryFn: () =>
      subscriptionsApi.getAll({
        clientId: client!.id,
        status: statusFilter || undefined,
        page,
        pageSize,
      }),
    enabled: Boolean(client && !hasBarcode),
  });

  if (!client) return null;

  const activeQuery = hasBarcode ? barcodeQuery : clientIdQuery;
  const subscriptions = activeQuery.data?.items || [];
  const totalCount = activeQuery.data?.totalCount || 0;
  const totalPages = activeQuery.data?.totalPages || 1;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '850px', width: '95%' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>
                اشتراكات العميل
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                عرض كافة الاشتراكات والباقات المسجلة للعميل
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Client summary card */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  color: '#0d1527',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: '#0d1527' }}>
                  {client.fullName}
                </strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                  {client.phoneNumber && (
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={13} />
                      <span dir="ltr">{client.phoneNumber}</span>
                    </span>
                  )}
                  {client.dateOfBirth && (
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} />
                      <span>{client.dateOfBirth.split('T')[0]}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {client.barcode ? (
              <span className="client-code-badge" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                <QrCode size={15} color="#0284c7" />
                {client.barcode}
              </span>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>لا يوجد باركود مسجل</span>
            )}
          </div>

          {/* Status filter toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              إجمالي الاشتراكات: {totalCount}
            </span>

            <select
              className="select-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as SubscriptionStatus | '');
                setPage(1);
              }}
              style={{ minWidth: '170px' }}
            >
              <option value="">جميع الحالات</option>
              <option value="Active">نشط (Active)</option>
              <option value="Completed">مكتمل (Completed)</option>
              <option value="Expired">منتهي (Expired)</option>
              <option value="Cancelled">ملغي (Cancelled)</option>
            </select>
          </div>

          {/* Subscriptions Table */}
          <div className="data-table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>النوع</th>
                  <th>المدة</th>
                  <th>الحصص</th>
                  <th>الصافي</th>
                  <th>المدفوع / المتبقي</th>
                  <th>حالة السداد</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {activeQuery.isLoading ? (
                  <tr>
                    <td colSpan={8} className="table-loading-row">
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="spinner" style={{ borderTopColor: '#ff6b22' }} />
                        <span>جاري تحميل اشتراكات العميل...</span>
                      </div>
                    </td>
                  </tr>
                ) : activeQuery.isError ? (
                  <tr>
                    <td colSpan={8} className="table-empty-row" style={{ color: '#ef4444' }}>
                      <AlertCircle size={22} style={{ margin: '0 auto 0.4rem', display: 'block' }} />
                      <span>تعذر تحميل اشتراكات العميل</span>
                    </td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="table-empty-row">
                      <Ticket size={28} style={{ margin: '0 auto 0.4rem', opacity: 0.3 }} />
                      <span>لا توجد اشتراكات مسجلة لهذا العميل {statusFilter ? 'بهذه الحالة' : ''}</span>
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td><span className="badge-id">{sub.id}</span></td>
                      <td>
                        <strong style={{ color: '#0d1527', fontSize: '0.85rem' }}>
                          {subscriptionTypeLabel(sub.subscriptionType)}
                        </strong>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        <div>{sub.startDate ? sub.startDate.slice(0, 10) : '—'}</div>
                        <div>إلى {sub.endDate ? sub.endDate.slice(0, 10) : '—'}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {sub.usedSessions} / {sub.totalSessions}
                      </td>
                      <td>
                        <strong style={{ color: '#0d1527' }}>
                          {sub.finalAmount.toLocaleString('ar-EG')} ج.م
                        </strong>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: '#0284c7', fontWeight: 600 }}>
                          {sub.paidAmount.toLocaleString('ar-EG')}
                        </span>
                        {sub.remainingAmount > 0 && (
                          <span style={{ color: '#ef4444', fontWeight: 600, marginInlineStart: '0.35rem' }}>
                            (متبقي {sub.remainingAmount.toLocaleString('ar-EG')})
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${paymentStatusBadgeClass(sub.paymentStatus)}`}>
                          {paymentStatusLabel(sub.paymentStatus)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${subscriptionStatusBadgeClass(sub.status)}`}>
                          {subscriptionStatusLabel(sub.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-wrapper" style={{ marginTop: '0.5rem' }}>
              <span>صفحة {page} من {totalPages}</span>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="btn-page"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  السابق
                </button>
                <button
                  type="button"
                  className="btn-page"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
