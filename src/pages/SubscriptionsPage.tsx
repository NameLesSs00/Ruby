import { useState } from 'react';
import { Ticket, Plus, Clock, History, Ban, Award } from 'lucide-react';
import {
  subscriptionKeys,
  type Subscription,
  type SubscriptionDuePayment,
} from '../modules/subscriptions';
import { queryClient } from '../lib/query-client';
import { SubscriptionsListTab } from '../components/subscriptions/SubscriptionsListTab';
import { SubscriptionAssignmentsTab } from '../components/subscriptions/SubscriptionAssignmentsTab';
import { SubscriptionDebtsTab } from '../components/subscriptions/SubscriptionDebtsTab';
import { SubscriptionHistoryTab } from '../components/subscriptions/SubscriptionHistoryTab';
import { SubscriptionCancellationsTab } from '../components/subscriptions/SubscriptionCancellationsTab';
import { SubscriptionFormModal } from '../components/subscriptions/SubscriptionFormModal';
import { SubscriptionDeleteModal } from '../components/subscriptions/SubscriptionDeleteModal';
import { CancelSubscriptionModal } from '../components/subscriptions/CancelSubscriptionModal';
import { RecordSubscriptionPaymentModal } from '../components/subscriptions/RecordSubscriptionPaymentModal';
import { SubscriptionAssignmentsModal } from '../components/subscriptions/SubscriptionAssignmentsModal';

type SubTab = 'subscriptions' | 'assignments' | 'debts' | 'history' | 'cancellations';

export const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('subscriptions');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [cancellingSubscription, setCancellingSubscription] = useState<Subscription | null>(null);
  const [payingSubscription, setPayingSubscription] = useState<Subscription | null>(null);
  const [payingDuePayment, setPayingDuePayment] = useState<SubscriptionDuePayment | null>(null);
  const [assignmentSubscription, setAssignmentSubscription] = useState<Subscription | null>(null);

  const handleOpenCreate = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsFormOpen(true);
  };

  const refreshSubscriptions = () => {
    queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
  };

  const TABS: { key: SubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'subscriptions', label: 'سجل الاشتراكات', icon: <Ticket size={16} /> },
    { key: 'assignments', label: 'تعيينات الكادر والمدربين', icon: <Award size={16} /> },
    { key: 'debts', label: 'الديون والمستحقات', icon: <Clock size={16} /> },
    { key: 'history', label: 'سجل التحصيلات', icon: <History size={16} /> },
    { key: 'cancellations', label: 'سجل الإلغاء والاسترداد', icon: <Ban size={16} /> },
  ];

  return (
    <div className="view-container">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F37023, #FF6B22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Ticket size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
              إدارة الاشتراكات والمستحقات
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              متابعة اشتراكات العملاء، الكادر التدريبي، ديون الاشتراكات وسجل الإلغاءات
            </p>
          </div>
        </div>

        {/* Tab Switcher & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="tab-switcher">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'subscriptions' && (
            <button type="button" className="btn-add" onClick={handleOpenCreate}>
              <Plus size={18} />
              <span>تسجيل اشتراك جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === 'subscriptions' && (
        <SubscriptionsListTab
          onEdit={handleEdit}
          onDelete={(sub) => setDeletingSubscription(sub)}
          onRecordPayment={(sub) => setPayingSubscription(sub)}
          onManageAssignments={(sub) => setAssignmentSubscription(sub)}
          onCancelSubscription={(sub) => setCancellingSubscription(sub)}
        />
      )}
      {activeTab === 'assignments' && <SubscriptionAssignmentsTab />}
      {activeTab === 'debts' && (
        <SubscriptionDebtsTab onSelectForPayment={(item) => setPayingDuePayment(item)} />
      )}
      {activeTab === 'history' && <SubscriptionHistoryTab />}
      {activeTab === 'cancellations' && <SubscriptionCancellationsTab />}

      {/* Modals */}
      <SubscriptionFormModal
        isOpen={isFormOpen}
        editingSubscription={editingSubscription}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          refreshSubscriptions();
        }}
      />
      <SubscriptionDeleteModal
        subscription={deletingSubscription}
        onClose={() => setDeletingSubscription(null)}
        onSuccess={() => {
          setDeletingSubscription(null);
          refreshSubscriptions();
        }}
      />
      <CancelSubscriptionModal
        isOpen={Boolean(cancellingSubscription)}
        subscription={cancellingSubscription}
        onClose={() => setCancellingSubscription(null)}
        onSuccess={() => {
          setCancellingSubscription(null);
          refreshSubscriptions();
        }}
      />
      <RecordSubscriptionPaymentModal
        isOpen={Boolean(payingSubscription || payingDuePayment)}
        subscription={payingSubscription}
        duePayment={payingDuePayment}
        onClose={() => {
          setPayingSubscription(null);
          setPayingDuePayment(null);
        }}
        onSuccess={refreshSubscriptions}
      />
      <SubscriptionAssignmentsModal
        isOpen={Boolean(assignmentSubscription)}
        subscription={assignmentSubscription}
        onClose={() => setAssignmentSubscription(null)}
      />
    </div>
  );
};
