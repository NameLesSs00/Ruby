import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Copy,
  Eye,
  UserCheck,
  Unlink,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import {
  barcodesApi,
  barcodeKeys,
  type BarcodeRecord,
  type BarcodeListResponse,
} from '../../modules/barcodes';
import { clientKeys } from '../../modules/clients';
import { PaginationBar } from '../ui/PaginationBar';
import { DetachBarcodeModal } from './DetachBarcodeModal';
import { showToast } from '../../lib/sonner';

export interface BarcodesTableProps {
  data?: BarcodeListResponse;
  isLoading: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onAssignClient: (barcode: BarcodeRecord) => void;
  onPreviewImage: (barcode: BarcodeRecord) => void;
}

export const BarcodesTable = ({
  data,
  isLoading,
  page,
  onPageChange,
  onAssignClient,
  onPreviewImage,
}: BarcodesTableProps) => {
  const queryClient = useQueryClient();
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'assigned'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [confirmDetachBarcode, setConfirmDetachBarcode] = useState<BarcodeRecord | null>(null);

  // Detach Mutation
  const detachMutation = useMutation({
    mutationFn: async (id: number) => {
      return await barcodesApi.detach(id);
    },
    onSuccess: (res) => {
      showToast.success(res.message || 'تم فك ارتباط الباركود بنجاح');
      queryClient.invalidateQueries({ queryKey: barcodeKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      setConfirmDetachBarcode(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.response?.data?.message || 'تعذر فك ارتباط الباركود';
      showToast.error(msg);
    },
  });

  // Toggle Status Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await barcodesApi.updateStatus(id, { isActive });
    },
    onSuccess: (res) => {
      showToast.success(res.message || 'تم تحديث حالة الباركود بنجاح');
      queryClient.invalidateQueries({ queryKey: barcodeKeys.all });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.response?.data?.message || 'تعذر تغيير حالة الباركود';
      showToast.error(msg);
    },
  });

  const handleCopy = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      showToast.success(`تم نسخ: ${val}`);
    } catch {
      showToast.error('تعذر النسخ');
    }
  };

  const allItems = data?.items || [];

  // Filter client-side
  const filteredItems = allItems.filter((item) => {
    if (filterAvailability === 'available' && !item.isAvailable) return false;
    if (filterAvailability === 'assigned' && item.isAvailable) return false;
    if (filterStatus === 'active' && !item.isActive) return false;
    if (filterStatus === 'inactive' && item.isActive) return false;
    return true;
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / data.pageSize)) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filters Bar */}
      <div
        className="card-base"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
            <Filter size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>تصفية حسب:</span>
          </div>

          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value as any)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            <option value="all">كافة التوفر (الكل)</option>
            <option value="available">متاح فقط (غير معين)</option>
            <option value="assigned">مُعين لعميل فقط</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            <option value="all">كافة الحالات (الكل)</option>
            <option value="active">نشط فقط</option>
            <option value="inactive">معطل فقط</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          عدد الباركودات المعروضة: <strong>{filteredItems.length}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>رمز الباركود</th>
              <th>الحالة</th>
              <th>التوفر</th>
              <th>العميل المرتبط</th>
              <th>تاريخ التعيين</th>
              <th>تاريخ الإنشاء</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>جاري تحميل الباركودات...</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  لا توجد باركودات مطابقة للبحث أو التصفية
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const canAssign = item.isAvailable && item.isActive;
                const canDetach = !item.isAvailable && !!item.clientId;
                const canToggleStatus = item.isAvailable;

                return (
                  <tr key={item.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.id}</td>

                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#0d1527',
                            backgroundColor: '#f1f5f9',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {item.barcodeValue}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.barcodeValue)}
                          className="btn-icon-action"
                          style={{ padding: '2px', border: 'none', background: 'transparent' }}
                          title="نسخ الرمز"
                        >
                          <Copy size={13} color="#94a3b8" />
                        </button>
                      </div>
                    </td>

                    <td>
                      {item.isActive ? (
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          نشط
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          معطل
                        </span>
                      )}
                    </td>

                    <td>
                      {item.isAvailable ? (
                        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          متاح
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          مُعين
                        </span>
                      )}
                    </td>

                    <td>
                      {item.clientFullName ? (
                        <span style={{ fontWeight: 600, color: '#0d1527' }}>
                          {item.clientFullName}
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginInlineStart: '4px' }}>
                            (#{item.clientId})
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString('ar-EG') : '—'}
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : '—'}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        {/* Preview Image */}
                        <button
                          type="button"
                          className="btn-icon-action"
                          onClick={() => onPreviewImage(item)}
                          title="عرض وطباعة صورة الباركود"
                        >
                          <Eye size={16} color="#3b82f6" />
                        </button>

                        {/* Assign Client */}
                        {canAssign && (
                          <button
                            type="button"
                            className="btn-icon-action"
                            onClick={() => onAssignClient(item)}
                            title="تعيين هذا الباركود لعميل"
                          >
                            <UserCheck size={16} color="#16a34a" />
                          </button>
                        )}

                        {/* Detach */}
                        {canDetach && (
                          <button
                            type="button"
                            className="btn-icon-action"
                            onClick={() => setConfirmDetachBarcode(item)}
                            title="فك ارتباط الباركود (يشترط عدم وجود اشتراكات نشطة للعميل)"
                          >
                            <Unlink size={16} color="#ef4444" />
                          </button>
                        )}

                        {/* Toggle Status */}
                        <button
                          type="button"
                          className="btn-icon-action"
                          disabled={!canToggleStatus || statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({ id: item.id, isActive: !item.isActive })
                          }
                          title={
                            canToggleStatus
                              ? item.isActive ? 'تعطيل الباركود' : 'تفعيل الباركود'
                              : 'يجب فك ارتباط الباركود أولاً قبل تغيير حالته'
                          }
                          style={{ opacity: canToggleStatus ? 1 : 0.4 }}
                        >
                          {item.isActive ? (
                            <ToggleRight size={18} color="#0284c7" />
                          ) : (
                            <ToggleLeft size={18} color="#94a3b8" />
                          )}
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

      {/* Pagination */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={data?.totalCount || 0}
        label="إجمالي الباركودات"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />

      {/* Detach Confirmation Modal */}
      <DetachBarcodeModal
        barcode={confirmDetachBarcode}
        isLoading={detachMutation.isPending}
        onConfirm={() => {
          if (confirmDetachBarcode) {
            detachMutation.mutate(confirmDetachBarcode.id);
          }
        }}
        onClose={() => setConfirmDetachBarcode(null)}
      />
    </div>
  );
};
