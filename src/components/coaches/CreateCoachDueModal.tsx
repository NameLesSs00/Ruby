import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Clock, X } from 'lucide-react';
import {
  coachDuesApi,
  coachDueKeys,
} from '../../modules/coachDues';
import { coachesApi } from '../../modules/coaches';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface CreateCoachDueModalProps {
  isOpen: boolean;
  defaultCoachId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCoachDueModal = ({
  isOpen,
  defaultCoachId,
  onClose,
  onSuccess,
}: CreateCoachDueModalProps) => {
  const [selectedCoach, setSelectedCoach] = useState<SelectOption | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      if (defaultCoachId) {
        coachesApi.getById(defaultCoachId).then((c) => {
          setSelectedCoach({
            id: c.id,
            label: c.fullName,
            subLabel: `هاتف: ${c.phoneNumber}`,
            tag: 'مدرب',
          });
        }).catch(() => {
          setSelectedCoach({ id: defaultCoachId, label: `مدرب #${defaultCoachId}` });
        });
      } else {
        setSelectedCoach(null);
      }
    }
  }, [isOpen, defaultCoachId]);

  const mutation = useMutation({
    mutationFn: coachDuesApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: coachDueKeys.all });
      showToast.success(res.message || 'تم تسجيل مستحق المدرب بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تسجيل مستحق المدرب');
    },
  });

  if (!isOpen) return null;

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مدرب',
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) {
      showToast.warning('يرجى اختيار المدرب أولاً');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (!description.trim()) {
      showToast.warning('يرجى إدخال بيان وسبب المستحق');
      return;
    }

    mutation.mutate({
      coachId: selectedCoach.id,
      amount: amountNum,
      description: description.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h3 className="modal-title">تسجيل مستحق مالي للمدرب</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                إضافة رصيد دائن للمدرب يستحق الصرف لاحقاً
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Coach Selector */}
            <div className="form-group">
              <label className="form-label required">المدرب المستحق</label>
              <AsyncSearchableSelect
                selectedItem={selectedCoach}
                onChange={setSelectedCoach}
                loadOptions={loadCoaches}
                placeholder="ابحث باسم المدرب أو الهاتف..."
                disabled={Boolean(defaultCoachId) || mutation.isPending}
              />
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label required">المبلغ المستحق (ج.م)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label required">البيان وسبب الاستحقاق</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="مثال: مستحقات تدريب حصص إضافية، مكافأة أداء، نسبة تدريب خاص..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'جاري التسجيل...' : 'تأكيد تسجيل المستحق'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

