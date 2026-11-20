import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Scan, Search } from 'lucide-react';
import { attendanceApi, attendanceKeys } from '../../modules/attendance';
import { subscriptionsApi, subscriptionKeys } from '../../modules/subscriptions';
import { clientsApi } from '../../modules/clients';
import { AsyncSearchableSelect, type SelectOption } from '../ui/AsyncSearchableSelect';
import { ClientAttendanceCard, type ClientAttendanceData } from './ClientAttendanceCard';
import { RecentCheckInsFeed } from './RecentCheckInsFeed';
import { showToast } from '../../lib/sonner';

export const QuickCheckInTab = () => {
  const queryClient = useQueryClient();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
  const [clientData, setClientData] = useState<ClientAttendanceData | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [searchMode, setSearchMode] = useState<'barcode' | 'manual'>('barcode');

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchMode === 'barcode') {
      barcodeInputRef.current?.focus();
    }
  }, [searchMode, clientData]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const { data: recentData, isLoading: isLoadingRecent } = useQuery({
    queryKey: attendanceKeys.list({ fromDate: todayStr, toDate: todayStr, page: 1, pageSize: 8 }),
    queryFn: () => attendanceApi.getAll({ fromDate: todayStr, toDate: todayStr, page: 1, pageSize: 8 }),
  });

  const recentCheckIns = recentData?.items || [];

  const handleLookupBarcode = async (rawCode: string) => {
    const trimmed = rawCode.trim();
    if (!trimmed) return;
    setIsSearchingBarcode(true);

    try {
      // 1. Fetch subscriptions associated with this barcode
      const subRes = await clientsApi.getSubscriptions({
        barcode: trimmed,
        page: 1,
        pageSize: 50,
      });

      const subs = subRes.items || [];

      // 2. Resolve client info either from subscriptions or via client search
      let resolvedClientId = 0;
      let resolvedClientName = '';

      if (subs.length > 0) {
        resolvedClientId = subs[0].clientId;
        resolvedClientName = subs[0].clientName;
      } else {
        // Query client by search to see if client exists even with 0 subscriptions
        const clientSearchRes = await clientsApi.getAll({
          search: trimmed,
          page: 1,
          pageSize: 10,
        });
        const matched = (clientSearchRes.items || []).find(
          (c) => c.barcode?.toLowerCase() === trimmed.toLowerCase()
        );
        if (matched) {
          resolvedClientId = matched.id;
          resolvedClientName = matched.fullName;
        }
      }

      if (!resolvedClientId) {
        showToast.error(`لم يتم العثور على مشترك يحمل الباركود "${trimmed}"`);
        setClientData(null);
        setSelectedSubId(null);
        return;
      }

      setClientData({
        clientId: resolvedClientId,
        fullName: resolvedClientName,
        barcode: trimmed,
        subscriptions: subs,
      });

      const activeSubs = subs.filter((s) => s.status === 'Active');
      setSelectedSubId(activeSubs.length > 0 ? activeSubs[0].id : null);
    } catch (err) {
      showToast.apiError(err, `لم يتم العثور على مشترك يحمل الباركود "${trimmed}"`);
      setClientData(null);
      setSelectedSubId(null);
    } finally {
      setIsSearchingBarcode(false);
    }
  };

  const handleBarcodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      handleLookupBarcode(barcodeInput);
    }
  };

  const handleManualSelect = async (opt: SelectOption | null) => {
    if (!opt) {
      setClientData(null);
      setSelectedSubId(null);
      return;
    }
    try {
      const c = await clientsApi.getById(opt.id);

      let subs: any[] = [];
      if (c.barcode) {
        const subRes = await clientsApi.getSubscriptions({
          barcode: c.barcode,
          page: 1,
          pageSize: 50,
        });
        subs = subRes.items || [];
      } else {
        const subRes = await subscriptionsApi.getAll({
          clientId: c.id,
          page: 1,
          pageSize: 50,
        });
        subs = subRes.items || [];
      }

      setClientData({
        clientId: c.id,
        fullName: c.fullName,
        barcode: c.barcode,
        phoneNumber: c.phoneNumber,
        subscriptions: subs,
      });

      const activeSubs = subs.filter((s) => s.status === 'Active');
      setSelectedSubId(activeSubs.length > 0 ? activeSubs[0].id : null);
    } catch {
      showToast.error('فشل في جلب اشتراكات المشترك');
    }
  };

  const loadClientOptions = async (q: string): Promise<SelectOption[]> => {
    const res = await clientsApi.getAll({
      search: q.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.barcode ? `${c.fullName} (${c.barcode})` : c.fullName,
      subLabel: c.phoneNumber ? `هاتف: ${c.phoneNumber}` : undefined,
      tag: 'مشترك',
    }));
  };

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.create,
    meta: {
      invalidate: [attendanceKeys.all, subscriptionKeys.all],
    },
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
      ]);
      showToast.success(res.message || 'تم تسجيل الحضور بنجاح');
      setBarcodeInput('');
      setNotes('');
      setClientData(null);
      setSelectedSubId(null);
      barcodeInputRef.current?.focus();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل حضور المشترك');
    },
  });

  const handleConfirmCheckIn = () => {
    if (!clientData) {
      showToast.warning('يرجى تحديد المشترك أولاً');
      return;
    }
    if (!selectedSubId) {
      showToast.warning('يرجى اختيار الاشتراك المراد تسجيل الحضور عليه');
      return;
    }

    checkInMutation.mutate({
      clientId: clientData.clientId,
      subscriptionId: selectedSubId,
      notes: notes.trim() || undefined,
    });
  };

  const resetAll = () => {
    setBarcodeInput('');
    setClientData(null);
    setSelectedSubId(null);
    setNotes('');
    barcodeInputRef.current?.focus();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Scanner Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scan size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
                  قارئ الباركود والتحقق
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  مرر بطاقة المشترك أو ابحث يدويًا بالاسم والهاتف
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className={`tab-btn ${searchMode === 'barcode' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setSearchMode('barcode')}
              >
                <Scan size={14} />
                <span>قارئ الباركود</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${searchMode === 'manual' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setSearchMode('manual')}
              >
                <Search size={14} />
                <span>بحث يدوي</span>
              </button>
            </div>
          </div>

          {searchMode === 'barcode' ? (
            <form onSubmit={handleBarcodeSubmit}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  className="form-input"
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    padding: '0.75rem 1rem 0.75rem 5.5rem',
                    borderColor: clientData ? '#10b981' : '#cbd5e1',
                  }}
                  placeholder="مرر الباركود أو اكتب كود الباركود واضغط Enter..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  disabled={isSearchingBarcode || checkInMutation.isPending}
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    position: 'absolute',
                    insetInlineEnd: '0.35rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.82rem',
                    width: 'auto',
                  }}
                  disabled={isSearchingBarcode || !barcodeInput.trim()}
                >
                  {isSearchingBarcode ? 'جاري الفحص...' : 'فحص'}
                </button>
              </div>
            </form>
          ) : (
            <AsyncSearchableSelect
              selectedItem={null}
              onChange={handleManualSelect}
              loadOptions={loadClientOptions}
              placeholder="ابحث باسم المشترك أو الهاتف أو الباركود..."
            />
          )}
        </div>

        {/* Client & Subscriptions Information Card */}
        {clientData && (
          <ClientAttendanceCard
            clientData={clientData}
            selectedSubId={selectedSubId}
            onSelectSubId={setSelectedSubId}
            notes={notes}
            onNotesChange={setNotes}
            onConfirmCheckIn={handleConfirmCheckIn}
            isPending={checkInMutation.isPending}
            onReset={resetAll}
          />
        )}
      </div>

      {/* Right Column: Live Feed */}
      <RecentCheckInsFeed items={recentCheckIns} isLoading={isLoadingRecent} />
    </div>
  );
};
