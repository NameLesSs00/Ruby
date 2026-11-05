import { Search, Plus, Package, Layers, X } from 'lucide-react';
import {
  getProductImageUrl,
  type Product,
  type ProductCategory,
} from '../../modules/products';

export interface PosCartItem {
  product: Product;
  quantity: number;
}

interface PosProductCatalogProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategoryId: number | 'all';
  onSelectCategory: (catId: number | 'all') => void;
  categories: ProductCategory[];
  products: Product[];
  isLoading: boolean;
  cart: PosCartItem[];
  onAddToCart: (product: Product) => void;
}

export const PosProductCatalog = ({
  searchTerm,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
  categories,
  products,
  isLoading,
  cart,
  onAddToCart,
}: PosProductCatalogProps) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 1.5rem',
        overflowY: 'auto',
        backgroundColor: '#f8fafc',
        borderInlineEnd: '1px solid #e2e8f0',
      }}
    >
      {/* Search & Categories Bar */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={18}
            color="#94a3b8"
            style={{ position: 'absolute', insetInlineStart: '1rem', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="ابحث بالاسم أو انقر على الصنف لإضافته مباشرة إلى الفاتورة..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.75rem',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                insetInlineEnd: '0.75rem',
                border: 'none',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
              title="مسح البحث"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: selectedCategoryId === 'all' ? '#0d1527' : '#cbd5e1',
              backgroundColor: selectedCategoryId === 'all' ? '#0d1527' : '#ffffff',
              color: selectedCategoryId === 'all' ? '#ffffff' : '#334155',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: selectedCategoryId === 'all' ? '0 2px 6px rgba(13,21,39,0.3)' : 'var(--shadow-sm)',
            }}
          >
            <Layers size={14} />
            <span>جميع الأصناف ({products.length})</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: selectedCategoryId === cat.id ? '#0d1527' : '#cbd5e1',
                backgroundColor: selectedCategoryId === cat.id ? '#0d1527' : '#ffffff',
                color: selectedCategoryId === cat.id ? '#ffffff' : '#334155',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: selectedCategoryId === cat.id ? '0 2px 6px rgba(13,21,39,0.3)' : 'var(--shadow-sm)',
              }}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
          <span style={{ marginInlineStart: '0.75rem', color: '#64748b', fontWeight: 600 }}>جاري تحميل الأصناف...</span>
        </div>
      ) : products.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <Package size={52} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
          <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#475569' }}>
            لا توجد منتجات مسجلة مطابقة للبحث
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>جرب البحث باسم صنف آخر أو اختر تصنيفاً مختلفاً</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
            gap: '1rem',
            alignContent: 'start',
          }}
        >
          {products.map((product) => {
            const imgUrl = getProductImageUrl(product.imageUrl);
            const inCartItem = cart.find((i) => i.product.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => onAddToCart(product)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: inCartItem ? '#ff6b22' : '#e2e8f0',
                  boxShadow: inCartItem ? '0 4px 12px rgba(255, 107, 34, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                  position: 'relative',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 21, 39, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = inCartItem
                    ? '0 4px 12px rgba(255, 107, 34, 0.2)'
                    : '0 1px 3px rgba(0,0,0,0.05)';
                }}
              >
                {inCartItem && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      insetInlineStart: 8,
                      backgroundColor: '#ff6b22',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      zIndex: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    }}
                  >
                    {inCartItem.quantity} في السلة
                  </div>
                )}

                <div
                  style={{
                    height: 120,
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.25s ease' }}
                    />
                  ) : (
                    <Package size={40} color="#94a3b8" />
                  )}
                </div>

                <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
                    {product.productCategoryName || 'عام'}
                  </span>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.35, flex: 1 }}>
                    {product.name}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ff6b22' }}>
                        {product.salePrice.toLocaleString('ar-EG')}{' '}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>ج.م</span>
                    </div>

                    <button
                      type="button"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: inCartItem ? '#0d1527' : '#f1f5f9',
                        color: inCartItem ? '#ffffff' : '#0d1527',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      title="إضافة إلى السلة"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

