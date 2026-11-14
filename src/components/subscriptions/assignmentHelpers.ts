import { subscriptionsApi } from '../../modules/subscriptions';
import { coachesApi } from '../../modules/coaches';
import { employeesApi } from '../../modules/employees';
import { clientsApi } from '../../modules/clients';
import type { SelectOption } from '../ui/AsyncSearchableSelect';

export const loadSubscriptionOptions = async (query: string): Promise<SelectOption[]> => {
  const trimmed = query.trim();
  let clientIds: number[] = [];

  if (trimmed && isNaN(Number(trimmed))) {
    try {
      const clientRes = await clientsApi.getAll({ search: trimmed, page: 1, pageSize: 5 });
      clientIds = (clientRes.items || []).map((c) => c.id);
    } catch {
      // ignore
    }
  }

  const res = await subscriptionsApi.getAll({
    page: 1,
    pageSize: 40,
    status: 'Active',
  });

  let subs = res.items || [];

  if (clientIds.length > 0) {
    try {
      const extraResults = await Promise.all(
        clientIds.slice(0, 3).map((cid) =>
          subscriptionsApi.getAll({ clientId: cid, page: 1, pageSize: 10 })
        )
      );
      const existingIds = new Set(subs.map((s) => s.id));
      extraResults.forEach((r) => {
        (r.items || []).forEach((s) => {
          if (!existingIds.has(s.id)) {
            subs.push(s);
            existingIds.add(s.id);
          }
        });
      });
    } catch {
      // ignore
    }
  }

  if (trimmed) {
    const lower = trimmed.toLowerCase();
    subs = subs.filter(
      (s) =>
        s.clientName?.toLowerCase().includes(lower) ||
        s.id.toString().includes(lower) ||
        s.subscriptionType?.toLowerCase().includes(lower)
    );
  }

  return subs.map((s) => {
    const typeLabel =
      s.subscriptionType === 'Sessions'
        ? 'حصص'
        : s.subscriptionType === 'Duration'
        ? 'مدة'
        : 'تدريب خاص';
    const dates = `${s.startDate ? s.startDate.slice(0, 10) : ''} إلى ${s.endDate ? s.endDate.slice(0, 10) : ''}`;
    return {
      id: s.id,
      label: `${s.clientName || 'عميل'} (اشتراك #${s.id})`,
      subLabel: `${typeLabel} — ${dates}`,
      tag: s.status === 'Active' ? 'نشط' : s.status,
    };
  });
};

export const loadCoachOptions = async (query: string): Promise<SelectOption[]> => {
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

export const loadEmployeeOptions = async (query: string): Promise<SelectOption[]> => {
  const res = await employeesApi.getAll({
    searchTerm: query.trim() || undefined,
    page: 1,
    pageSize: 20,
  });
  return (res.items || []).map((e) => ({
    id: e.id,
    label: e.fullName,
    subLabel: `المسمى: ${e.jobTitle} — هاتف: ${e.phoneNumber}`,
    tag: 'موظف',
  }));
};
