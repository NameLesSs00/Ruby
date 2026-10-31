import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, Calendar, AlertCircle, Coins, CreditCard } from 'lucide-react';
import { payrollPaymentsApi, payrollsApi, payrollKeys } from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { EmployeeNameCell } from './EmployeeNameCell';

interface PayrollPaymentsTabProps {
  employees: Employee[];
}

function fmt(val: number) { return val.toLocaleString('ar-EG'); }
function fmtMonth(iso: string) { return iso ? iso.slice(0, 7) : '—'; }

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('ar-EG')} - ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateStr;
  }
}

export const PayrollPaymentsTab = ({ employees }: PayrollPaymentsTabProps) => {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // 1. Fetch all payroll payment transactions
  const { data: payments = [], isLoading: isLoadingPayments, isError: isErrorPayments } = useQuery({
    queryKey: payrollKeys.payments(),
    queryFn: () => payrollPaymentsApi.getAll(),
  });

  // 2. Fetch payroll records to map payrollId -> employeeId & payrollMonth
  const { data: payrolls = [] } = useQuery({
    queryKey: payrollKeys.lists(),
    queryFn: () => payrollsApi.getAll(),
  });

  const payrollMap = useMemo(() => {
    const map = new Map<number, (typeof payrolls)[0]>();
    payrolls.forEach((p) => map.set(p.id, p));
    return map;
  }, [payrolls]);

  // 3. Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const payroll = payrollMap.get(pay.payrollId);
      const empId = payroll?.employeeId;
      const month = payroll?.payrollMonth;

      const matchEmp = !filterEmployeeId || (empId !== undefined && Number(empId) === Number(filterEmployeeId));
      const matchMonth = !filterMonth || (month !== undefined && month.startsWith(filterMonth));

      return matchEmp && matchMonth;
    });
  }, [payments, payrollMap, filterEmployeeId, filterMonth]);

  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  }, [filteredPayments]);

  return (
    <>
      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          backgroundColor: '#fff', padding: '1rem 1.25rem', borderRadius: '10px',
          border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '10px', backgroundColor: '#F3702315',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F37023'
          }}>
            <Coins size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>إجمالي المبالغ المصروفة</span>
            <strong style={{ fontSize: '1.25rem', color: '#0D1527' }}>{fmt(totalAmount)} <span style={{ fontSize: '0.85rem' }}>ج.م</span></strong>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff', padding: '1rem 1.25rem', borderRadius: '10px',
          border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '10px', backgroundColor: '#36C5F020',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7'
          }}>
            <CreditCard size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>عدد حركات الصرف</span>
            <strong style={{ fontSize: '1.25rem', color: '#0D1527' }}>{filteredPayments.length} حركة</strong>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="select-filter"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
          >
            <option value="">جميع الموظفين</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>

          <input
            type="month"
            className="form-input"
            style={{ width: 'auto' }}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />

          {(filterEmployeeId || filterMonth) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setFilterEmployeeId(''); setFilterMonth(''); }}
              style={{ padding: '0.5rem 1rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>#</th>
              <th>الموظف</th>
              <th>شهر الراتب</th>
              <th>المبلغ المصروف</th>
              <th>تاريخ ووقت الصرف</th>
              <th>الخزينة</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingPayments ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل سجل المدفوعات...</span>
                  </div>
                </td>
              </tr>
            ) : isErrorPayments ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل سجل مدفوعات الرواتب</span>
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <Receipt size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <span>لا توجد حركات صرف مسجلة {filterEmployeeId || filterMonth ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, idx) => {
                const payroll = payrollMap.get(p.payrollId);
                const employeeId = payroll?.employeeId;

                return (
                  <tr key={p.id}>
                    <td><span className="badge-id">{idx + 1}</span></td>
                    <td>
                      {employeeId ? (
                        <EmployeeNameCell employeeId={employeeId} fallbackEmployees={employees} />
                      ) : (
                        <span style={{ color: '#64748B' }}>مسيرة #{p.payrollId}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                        <Calendar size={15} />
                        <span>{payroll ? fmtMonth(payroll.payrollMonth) : '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.95rem' }}>
                        +{fmt(p.amountPaid)} <span className="currency-unit">ج.م</span>
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>
                      {formatDateTime(p.paymentDate)}
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: '4px', backgroundColor: '#F1F5F9',
                        fontSize: '0.8rem', color: '#475569', fontWeight: 500
                      }}>
                        خزينة #{p.cashboxId}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

