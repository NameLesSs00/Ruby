import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, UserCheck, AlertCircle } from 'lucide-react';
import { barcodesApi, barcodeKeys, type BarcodeRecord } from '../../modules/barcodes';
import { clientsApi, clientKeys } from '../../modules/clients';
import { AsyncSearchableSelect, type SelectOption } from '../ui/AsyncSearchableSelect';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

export interface AssignBarcodeModalProps {
  barcode: BarcodeRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AssignBarcodeModal = ({ barcode, onClose, onSuccess }: AssignBarcodeModalProps) => {
  useModalEscape(onClose);
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<SelectOption | null>(null);

  const assignMutation = useMutation({
    mutationFn: async ({ barcodeId, clientId }: { barcodeId: number; clientId: number }) => {
      return await barcodesApi.assignClient(barcodeId, { clientId });
    },
    meta: {
      invalidate: [barcodeKeys.all, clientKeys.all],
    },
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: barcodeKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      ]);
      showToast.success(res.message || 'تم تعيين الباركود للعميل بنجاح');
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.response?.data?.message || 'تعذر تعيين الباركود للعميل';
      showToast.error(msg);
    },
  });

  if (!barcode) return null;

  const handleLoadClients = async (query: string): Promise<SelectOption[]> => {
    try {
      const res = await clientsApi.getAll({
        search: query.trim() || undefined,
        pageSize: 15,
      });
      return (res.items || []).map((c) => ({
        id: c.id,
        label: c.fullName,
        subLabel: c.phoneNumber ? `الهاتف: ${c.phoneNumber}` : undefined,
        tag: c.clientCode,
      }));
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      showToast.error('يرجى اختيار العميل أولاً');
      return;
    }
    assignMutation.mutate({
      barcodeId: barcode.id,
      clientId: selectedClient.id,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} color="#ff6b22" />
            <h3 className="modal-title">تعيين باركود لعميل</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
                  رمز الباركود المحدد:
                </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0d1527' }}>
                  {barcode.barcodeValue}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 600,
                }}
              >
                متاح للتعيين
              </span>
            </div>

            <AsyncSearchableSelect
              label="اختر العميل"
              placeholder="ابحث بالاسم أو كود العميل أو الهاتف..."
              selectedItem={selectedClient}
              onChange={setSelectedClient}
              loadOptions={handleLoadClients}
              required
              helperText="اختر العميل الذي ترغب في ربط هذا الباركود بملفه"
            />

            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start',
              }}
            >
              <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.5 }}>
                تنبيه: عند ربط هذا الباركود، سيصبح مخصصاً لهذا العميل لاستخدامه في تسجيل الحضور والاشتراكات.
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={assignMutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={!selectedClient || assignMutation.isPending}
              style={{ minWidth: '120px' }}
            >
              {assignMutation.isPending ? 'جاري التعيين...' : 'تأكيد التعيين'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

