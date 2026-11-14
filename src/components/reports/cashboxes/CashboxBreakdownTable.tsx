import type { CashboxBreakdownItem } from '../../../modules/reports';

interface CashboxBreakdownTableProps {
  cashboxes?: CashboxBreakdownItem[];
  isLoading: boolean;
}

export const CashboxBreakdownTable = ({ cashboxes = [], isLoading }: CashboxBreakdownTableProps) => {
  if (isLoading) {
    return (
      <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>جاري تحميل جدول أرصدة الخزائن...</p>
      </div>
    );
  }

  if (cashboxes.length === 0) return null;

  const getCashboxArabicName = (type: string) => {
    switch (type) {
      case 'POS':
        return 'خزينة نقطة البيع (POS)';
      case 'Subscriptions':
        return 'خزينة الاشتراكات';
      case 'Main':
        return 'الخزينة الرئيسية';
      default:
        return type;
    }
  };

  return (
    <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
        أرصدة وحركات الخزائن التفصيلية
      </h3>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%', textAlign: 'start' }}>
          <thead>
            <tr>
              <th>الخزينة</th>
              <th style={{ textAlign: 'center' }}>رصيد البداية</th>
              <th style={{ textAlign: 'center' }}>مقبوضات الفترة</th>
              <th style={{ textAlign: 'center' }}>مدفوعات الفترة</th>
              <th style={{ textAlign: 'center' }}>رصيد الإغلاق</th>
              <th style={{ textAlign: 'end' }}>الرصيد الفعلي الحالي</th>
            </tr>
          </thead>
          <tbody>
            {cashboxes.map((c) => (
              <tr key={c.cashboxType}>
                <td style={{ fontWeight: 700, color: '#0D1527' }}>
                  {getCashboxArabicName(c.cashboxType)}
                </td>
                <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 500 }}>
                  {c.openingBalance.toLocaleString('en-US')} ج.م
                </td>
                <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>
                  +{c.periodIncoming.toLocaleString('en-US')} ج.م
                </td>
                <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>
                  -{c.periodOutgoing.toLocaleString('en-US')} ج.م
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                  {c.closingBalance.toLocaleString('en-US')} ج.م
                </td>
                <td style={{ textAlign: 'end', fontWeight: 700, color: '#0369a1', fontSize: '0.9375rem' }}>
                  {c.currentBalance.toLocaleString('en-US')} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
