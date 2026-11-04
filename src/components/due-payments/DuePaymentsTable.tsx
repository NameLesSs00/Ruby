import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Eye,
} from 'lucide-react';
import {
  dueTypeLabel,
  dueStatusLabel,
  type DuePayment,
  type DuePaymentStatus,
  type DueType,
} from '../../modules/duePayments';
import { PaginationBar } from '../ui/PaginationBar';
import { DuePaymentDetailsModal } from './DuePaymentDetailsModal';

interface DuePaymentsTableProps {
  items: DuePayment[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRecordPayment: (item: DuePayment) => void;
}

const getDueTypeBadge = (type: DueType) => {
  const styles: Record<DueType, { bg: string; color: string; border: string }> = {
    Subscription: { bg: '#eff6ff', color: '#0284c7', border: '#bae6fd' },
    Sale: { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
    ExternalEntity: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  };
  const s = styles[type] || styles.ExternalEntity;

  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: '0.15rem 0.5rem',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {dueTypeLabel(type)}
    </span>
  );
};

const getStatusBadge = (status: DuePaymentStatus) => {
  const styles: Record<DuePaymentStatus, { bg: string; color: string; border: string }> = {
    Paid: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    PartiallyPaid: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    Unpaid: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };
  const s = styles[status] || styles.Unpaid;

  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: '0.25rem 0.7rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {dueStatusLabel(status)}
    </span>
  );
};

export const DuePaymentsTable = ({
  items,
  isLoading,
  isError,
  searchTerm,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onRecordPayment,
}: DuePaymentsTableProps) => {
  const [selectedDue, setSelectedDue] = useState<DuePayment | null>(null);

  return (
    <>
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap' }}>اسم المدين والنوع</th>
              <th style={{ whiteSpace: 'nowrap' }}>إجمالي الدين</th>
              <th style={{ whiteSpace: 'nowrap' }}>المسدد</th>
              <th style={{ whiteSpace: 'nowrap' }}>المتبقي</th>
              <th style={{ width: 140, whiteSpace: 'nowrap' }}>نسبة السداد</th>
              <th style={{ whiteSpace: 'nowrap' }}>الحالة</th>
              <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className="spinner"
                      style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                    />
                    <span>جاري تحميل سجل الديون والمستحقات...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل الديون، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-row">
                  <span>لا توجد ديون مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const itemPercent =
                  item.totalAmount > 0
                    ? Math.min(100, Math.round(((item.paidAmount || 0) / item.totalAmount) * 100))
                    : 100;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <User size={15} color="#475569" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0d1527', whiteSpace: 'nowrap' }}>
                            {item.payerName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                            {getDueTypeBadge(item.dueType)}
                            {item.subscriptionId && (
                              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
                                اشتراك #{item.subscriptionId}
                              </span>
                            )}
                            {item.saleId && (
                              <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>
                                فاتورة #{item.saleId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>
                        {item.totalAmount.toLocaleString('ar-EG')}{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                      </span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>
                        {item.paidAmount.toLocaleString('ar-EG')}{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                      </span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          color: item.remainingAmount > 0 ? '#b91c1c' : '#16a34a',
                        }}
                      >
                        {item.remainingAmount.toLocaleString('ar-EG')}{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 100 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                          {itemPercent}%
                        </span>
                        <div
                          style={{
                            width: '100%',
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: '#f1f5f9',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${itemPercent}%`,
                              borderRadius: 999,
                              backgroundColor:
                                itemPercent >= 100
                                  ? '#10b981'
                                  : itemPercent > 0
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(item.status)}</td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div className="table-actions" style={{ justifyContent: 'center', gap: '0.45rem' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="عرض كافة التفاصيل"
                          onClick={() => setSelectedDue(item)}
                          style={{
                            color: '#0284c7',
                            backgroundColor: '#f0f9ff',
                            border: '1px solid #bae6fd',
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        {item.remainingAmount > 0 ? (
                          <button
                            type="button"
                            className="btn-add"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              gap: '0.35rem',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                            onClick={() => onRecordPayment(item)}
                          >
                            <CreditCard size={14} />
                            <span>سداد دفعة</span>
                          </button>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: '#16a34a',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>مسدد</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            label="إجمالي سجلات الديون"
            isLoading={isLoading}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Due Payment Details Modal */}
      <DuePaymentDetailsModal
        isOpen={Boolean(selectedDue)}
        duePayment={selectedDue}
        onClose={() => setSelectedDue(null)}
        onRecordPayment={onRecordPayment}
      />
    </>
  );
};
