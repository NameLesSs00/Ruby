import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Plus, ShieldCheck } from 'lucide-react';
import {
  adminsApi,
  adminKeys,
  type AdminUser,
  type AdminRole,
} from '../modules/admins';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { AdminsTable } from '../components/admins/AdminsTable';
import { AdminFormModal } from '../components/admins/AdminFormModal';
import { AdminPasswordModal } from '../components/admins/AdminPasswordModal';

export const AdminsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deactivated'>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [passwordAdmin, setPasswordAdmin] = useState<AdminUser | null>(null);

  const { data: admins = [], isLoading, isError } = useQuery({
    queryKey: adminKeys.lists(),
    queryFn: () => adminsApi.getAll(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isDeactivated }: { id: string; isDeactivated: boolean }) =>
      adminsApi.updateStatus(id, { isDeactivated }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      showToast.success(
        variables.isDeactivated ? 'تم تعطيل حساب المسؤول بنجاح' : 'تم تفعيل حساب المسؤول بنجاح'
      );
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تعديل حالة المسؤول');
    },
  });

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        !searchTerm.trim() ||
        admin.userName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesRole =
        selectedRole === 'all' || admin.role === selectedRole;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !admin.isDeactivated) ||
        (statusFilter === 'deactivated' && admin.isDeactivated);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, searchTerm, selectedRole, statusFilter]);

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (admin: AdminUser) => {
    if (admin.role === 'SuperAdmin') {
      showToast.warning('لا يمكن تعطيل حساب مدير عام النظام');
      return;
    }
    statusMutation.mutate({
      id: admin.id,
      isDeactivated: !admin.isDeactivated,
    });
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0D1527, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={22} color="#36C5F0" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
            إدارة المسؤولين والمشرفين
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            إدارة حسابات المسؤولين وتعيين الصلاحيات وإعادة تعيين كلمات المرور
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="view-toolbar">
        <div className="toolbar-filters">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="البحث باسم المستخدم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as AdminRole | 'all')}
          >
            <option value="all">جميع الأدوار</option>
            <option value="SuperAdmin">مدير عام النظام (SuperAdmin)</option>
            <option value="ReceptionAdmin">مسؤول استقبال (ReceptionAdmin)</option>
            <option value="ShopAdmin">مسؤول متجر (ShopAdmin)</option>
          </select>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'deactivated')}
          >
            <option value="all">جميع الحالات</option>
            <option value="active">النشطون فقط</option>
            <option value="deactivated">المعطلون فقط</option>
          </select>
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>إضافة مسؤول جديد</span>
        </button>
      </div>

      <AdminsTable
        admins={filteredAdmins}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        statusMutationPending={statusMutation.isPending}
        onEdit={handleOpenEdit}
        onResetPassword={(admin) => setPasswordAdmin(admin)}
        onToggleStatus={handleToggleStatus}
      />

      <AdminFormModal
        isOpen={isFormOpen}
        editingAdmin={editingAdmin}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAdmin(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingAdmin(null);
        }}
      />

      <AdminPasswordModal
        admin={passwordAdmin}
        onClose={() => setPasswordAdmin(null)}
        onSuccess={() => setPasswordAdmin(null)}
      />
    </div>
  );
};

