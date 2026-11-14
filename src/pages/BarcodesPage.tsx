import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QrCode, PlusCircle, ListFilter } from 'lucide-react';
import { barcodesApi, barcodeKeys, type BarcodeRecord } from '../modules/barcodes';
import { BarcodesTable } from '../components/barcodes/BarcodesTable';
import { GenerateBarcodesCard } from '../components/barcodes/GenerateBarcodesCard';
import { BarcodeImageModal } from '../components/barcodes/BarcodeImageModal';
import { AssignBarcodeModal } from '../components/barcodes/AssignBarcodeModal';

export const BarcodesPage = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'generate'>('list');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);

  const [selectedBarcodeForImage, setSelectedBarcodeForImage] = useState<BarcodeRecord | null>(null);
  const [selectedBarcodeForAssign, setSelectedBarcodeForAssign] = useState<BarcodeRecord | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: barcodeKeys.list({ page, pageSize }),
    queryFn: () => barcodesApi.getAll({ page, pageSize }),
  });

  return (
    <div className="page-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <QrCode size={26} color="#ff6b22" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
              إدارة الباركودات
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
            توليد وتعيين ومتابعة بطاقات ورموز الباركود المخصصة للأعضاء والاشتراكات
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'list' ? '#ffffff' : 'transparent',
              color: activeTab === 'list' ? '#0d1527' : '#64748b',
              boxShadow: activeTab === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ListFilter size={16} />
            <span>قائمة الباركودات ({data?.totalCount ?? '...'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'generate' ? '#ffffff' : 'transparent',
              color: activeTab === 'generate' ? '#ff6b22' : '#64748b',
              boxShadow: activeTab === 'generate' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <PlusCircle size={16} />
            <span>توليد باركودات جديدة</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'list' ? (
        <BarcodesTable
          data={data}
          isLoading={isLoading}
          page={page}
          onPageChange={setPage}
          onAssignClient={setSelectedBarcodeForAssign}
          onPreviewImage={setSelectedBarcodeForImage}
        />
      ) : (
        <GenerateBarcodesCard
          onPreviewBarcode={setSelectedBarcodeForImage}
          onBarcodeGenerated={() => {}}
        />
      )}

      {/* Barcode Image Lightbox */}
      {selectedBarcodeForImage && (
        <BarcodeImageModal
          barcode={selectedBarcodeForImage}
          onClose={() => setSelectedBarcodeForImage(null)}
        />
      )}

      {/* Assign Client Modal */}
      {selectedBarcodeForAssign && (
        <AssignBarcodeModal
          barcode={selectedBarcodeForAssign}
          onClose={() => setSelectedBarcodeForAssign(null)}
        />
      )}
    </div>
  );
};
export default BarcodesPage;

