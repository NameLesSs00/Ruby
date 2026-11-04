import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Scan, Search } from 'lucide-react';
import { attendanceApi, attendanceKeys } from '../../modules/attendance';
import { clientsApi, type ClientWithEligibleSubscriptions } from '../../modules/clients';
import { AsyncSearchableSelect, type SelectOption } from '../ui/AsyncSearchableSelect';
import { ClientAttendanceCard } from './ClientAttendanceCard';
import { RecentCheckInsFeed } from './RecentCheckInsFeed';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

export const QuickCheckInTab = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
  const [clientData, setClientData] = useState<ClientWithEligibleSubscriptions | null>(null);
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

  const handleLookupBarcode = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setIsSearchingBarcode(true);
    try {
      const res = await clientsApi.getByBarcode(trimmed);
      setClientData(res);
      const eligible = res.eligibleSubscriptions || [];
      setSelectedSubId(eligible.length > 0 ? eligible[0].subscriptionId : null);
    } catch {
      showToast.error(`لم يتم العثور على مشترك يحمل الكود "${trimmed}"`);
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
      if (c.clientCode) {
        handleLookupBarcode(c.clientCode);
      } else {
        showToast.warning('هذا المشترك لا يمتلك كود مسجل');
      }
    } catch {
      showToast.error('فشل في جلب بيانات المشترك');
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
      label: `${c.fullName} (${c.clientCode})`,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مشترك',
    }));
  };

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
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
                  placeholder="مرر الباركود أو اكتب كود المشترك واضغط Enter..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  disabled={isSearchingBarcode || checkInMutation.isPending}
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
              placeholder="ابحث باسم المشترك أو الهاتف أو الكود..."
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
