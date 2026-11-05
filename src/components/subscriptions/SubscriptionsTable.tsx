import {
  Edit2,
  Trash2,
  AlertCircle,
  Ticket,
  Award,
  CreditCard,
  UserCheck,
  Ban,
} from 'lucide-react';
import {
  type Subscription,
  clientTypeLabel,
  subscriptionTypeLabel,
  subscriptionStatusLabel,
  subscriptionStatusBadgeClass,
  paymentStatusLabel,
  paymentStatusBadgeClass,
} from '../../modules/subscriptions';

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  onRecordPayment?: (subscription: Subscription) => void;
  onManageAssignments?: (subscription: Subscription) => void;
  onCancelSubscription?: (subscription: Subscription) => void;
}

function fmt(val: number) {
  return val.toLocaleString('ar-EG');
}

export const SubscriptionsTable = ({
  subscriptions,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onRecordPayment,
  onManageAssignments,
  onCancelSubscription,
}: SubscriptionsTableProps) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th>العميل</th>
            <th>نوع الاشتراك</th>
            <th>المدرب ذو العمولة</th>
            <th>الفترة</th>
            <th>الحصص</th>
            <th>الصافي</th>
            <th>المدفوع</th>
            <th>المتبقي</th>
            <th>حالة السداد</th>
            <th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={12} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل الاشتراكات...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={12} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                <span>تعذر تحميل قائمة الاشتراكات</span>
              </td>
            </tr>
          ) : subscriptions.length === 0 ? (
            <tr>
              <td colSpan={12} className="table-empty-row">
                <Ticket size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <span>لا توجد أي اشتراكات مسجلة مطابقة للبحث</span>
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => {
              const hasRemaining = sub.remainingAmount > 0;

              return (
                <tr key={sub.id}>
                  <td><span className="badge-id">{sub.id}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <strong style={{ color: '#0D1527' }}>{sub.clientName}</strong>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: sub.clientType === 'Academy' ? '#0284C7' : '#F37023',
                          fontWeight: 600,
                        }}
                      >
                        {clientTypeLabel(sub.clientType)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#F1F5F9',
                        fontSize: '0.8rem',
                        color: '#334155',
                        fontWeight: 500,
                      }}
                    >
                      {subscriptionTypeLabel(sub.subscriptionType)}
                    </span>
                  </td>
                  <td>
                    {sub.commissionCoachName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0F172A', fontSize: '0.85rem' }}>
                        <Award size={14} color="#F37023" />
                        <span>{sub.commissionCoachName}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem', color: '#64748B' }}>
                      <span>من: {sub.startDate.slice(0, 10)}</span>
                      <span>إلى: {sub.endDate.slice(0, 10)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0D1527' }}>
                        {sub.usedSessions} / {sub.totalSessions} حصة
                      </span>
                      <div
                        style={{
                          width: '65px',
                          height: '5px',
                          backgroundColor: '#E2E8F0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, sub.totalSessions > 0 ? (sub.usedSessions / sub.totalSessions) * 100 : 0)}%`,
                            height: '100%',
                            backgroundColor: '#36C5F0',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#0D1527' }}>
                      {fmt(sub.finalAmount)} <span className="currency-unit">ج.م</span>
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: '#0284C7', fontWeight: 600 }}>{fmt(sub.paidAmount)}</span>
                  </td>
                  <td>
                    <span style={{ color: hasRemaining ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                      {fmt(sub.remainingAmount)}
                    </span>
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
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center', gap: '0.35rem' }}>
                      {onRecordPayment && hasRemaining && (
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="سداد دفعة من المبلغ المتبقي"
                          onClick={() => onRecordPayment(sub)}
                          style={{ color: '#0d1527', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                        >
                          <CreditCard size={15} />
                        </button>
                      )}

                      {onManageAssignments && (
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="تعيين مدربين أو موظفين للاشتراك"
                          onClick={() => onManageAssignments(sub)}
                          style={{ color: '#0284c7', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
                        >
                          <UserCheck size={15} />
                        </button>
                      )}

                      {onCancelSubscription && sub.status !== 'Cancelled' && (
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="إلغاء الاشتراك وتسجيل استرداد"
                          onClick={() => onCancelSubscription(sub)}
                          style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                        >
                          <Ban size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات الاشتراك"
                        onClick={() => onEdit(sub)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف الاشتراك"
                        onClick={() => onDelete(sub)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
