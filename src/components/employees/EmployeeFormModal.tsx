import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  employeesApi,
  employeeKeys,
  type Employee,
  type CreateEmployeePayload,
  type UpdateEmployeePayload,
} from '../../modules/employees';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface EmployeeFormModalProps {
  isOpen: boolean;
  editingEmployee: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmployeeFormModal = ({
  isOpen,
  editingEmployee,
  onClose,
  onSuccess,
}: EmployeeFormModalProps) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [hireDate, setHireDate] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingEmployee) {
      setFullName(editingEmployee.fullName);
      setPhoneNumber(editingEmployee.phoneNumber);
      setJobTitle(editingEmployee.jobTitle);
      setMonthlySalary(editingEmployee.monthlySalary.toString());
      setHireDate(editingEmployee.hireDate ? editingEmployee.hireDate.split('T')[0] : '');
    } else {
      setFullName('');
      setPhoneNumber('');
      setJobTitle('');
      setMonthlySalary('');
      const today = new Date().toISOString().split('T')[0];
      setHireDate(today);
    }
  }, [editingEmployee, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تمت إضافة الموظف بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة الموظف، يرجى المحاولة لاحقاً');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) =>
      employeesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تم تحديث بيانات الموظف بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في تحديث بيانات الموظف');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast.warning('يرجى كتابة اسم الموظف بالكامل');
      return;
    }
    if (!phoneNumber.trim()) {
      showToast.warning('يرجى إدخال رقم هاتف الموظف');
      return;
    }
    if (!jobTitle.trim()) {
      showToast.warning('يرجى كتابة المسمى الوظيفي');
      return;
    }

    const salaryNum = parseFloat(monthlySalary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      showToast.warning('يرجى إدخال راتب شهري صحيح');
      return;
    }
    if (!hireDate) {
      showToast.warning('يرجى تحديد تاريخ التعيين');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      jobTitle: jobTitle.trim(),
      monthlySalary: salaryNum,
      hireDate,
    };

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="employee-name">
                اسم الموظف بالكامل <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="employee-name"
                type="text"
                className="form-input"
                placeholder="مثال: أحمد محمود"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employee-job">
                المسمى الوظيفي <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="employee-job"
                type="text"
                className="form-input"
                placeholder="مثال: موظف استقبال / محاسب / مشرف"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employee-phone">
                رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="employee-phone"
                type="tel"
                className="form-input"
                placeholder="01012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isSaving}
                dir="ltr"
                style={{ textAlign: 'end' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employee-salary">
                الراتب الشهري (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="employee-salary"
                  type="number"
                  min="0"
                  step="100"
                  className="form-input"
                  placeholder="مثال: 8000"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employee-hire-date">
                تاريخ التعيين <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="employee-hire-date"
                type="date"
                className="form-input"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingEmployee ? 'حفظ التعديلات' : 'إضافة الموظف'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
