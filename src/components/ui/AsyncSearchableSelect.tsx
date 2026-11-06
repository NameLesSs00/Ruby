import { useState, useEffect, useRef } from 'react';
import { Search, X, Check, Loader2, ChevronDown } from 'lucide-react';

export interface SelectOption {
  id: number;
  label: string;
  subLabel?: string;
  tag?: string;
}

interface AsyncSearchableSelectProps {
  label?: string;
  placeholder?: string;
  selectedItem: SelectOption | null;
  onChange: (option: SelectOption | null) => void;
  loadOptions: (query: string) => Promise<SelectOption[]>;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AsyncSearchableSelect = ({
  label,
  placeholder = 'ابحث بالاسم أو رقم الهاتف...',
  selectedItem,
  onChange,
  loadOptions,
  required = false,
  disabled = false,
  helperText,
  style,
  className = 'form-group',
}: AsyncSearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch options with debounce
  const fetchOptions = (query: string) => {
    setIsLoading(true);
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(async () => {
      try {
        const results = await loadOptions(query);
        setOptions(results);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleOpenDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    fetchOptions(searchTerm);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    fetchOptions(val);
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
    setIsOpen(true);
    fetchOptions('');
  };

  return (
    <div className={className} ref={containerRef} style={{ position: 'relative', ...style }}>
      {label && (
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>{label}</span>
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      {/* Selected Item Card View */}
      {selectedItem ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              {selectedItem.label.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.9rem' }}>
                  {selectedItem.label}
                </span>
                {selectedItem.tag && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  >
                    {selectedItem.tag}
                  </span>
                )}
              </div>
              {selectedItem.subLabel && (
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {selectedItem.subLabel}
                </span>
              )}
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                borderRadius: '4px',
                padding: '0.25rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                flexShrink: 0,
              }}
              title="تغيير الاختيار"
            >
              <X size={14} />
              <span>تغيير</span>
            </button>
          )}
        </div>
      ) : (
        /* Unselected Input / Trigger */
        <div style={{ position: 'relative' }}>
          <div
            onClick={handleOpenDropdown}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
              border: isOpen ? '1px solid #ff6b22' : '1px solid #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 0.75rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              gap: '0.5rem',
              boxShadow: isOpen ? '0 0 0 2px rgba(255, 107, 34, 0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              disabled={disabled}
              onChange={(e) => {
                if (!isOpen) setIsOpen(true);
                handleSearchChange(e.target.value);
              }}
              onFocus={handleOpenDropdown}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '0.85rem',
                color: '#0d1527',
                fontFamily: 'inherit',
              }}
            />
            {isLoading ? (
              <Loader2 size={16} color="#0d1527" className="spinner" />
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                <Search size={15} color="#94a3b8" />
                <ChevronDown size={15} color="#94a3b8" />
              </div>
            )}
          </div>

          {/* Results Dropdown Menu */}
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                insetInlineStart: 0,
                insetInlineEnd: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                maxHeight: '230px',
                overflowY: 'auto',
                zIndex: 50,
              }}
            >
              {isLoading && options.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  <Loader2 size={18} color="#ff6b22" className="spinner" style={{ margin: '0 auto 0.4rem', display: 'block' }} />
                  <span>جاري البحث في السجلات...</span>
                </div>
              ) : options.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>لا توجد نتائج مطابقة لبحثك</span>
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#0d1527', fontSize: '0.85rem' }}>
                          {option.label}
                        </span>
                        {option.tag && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: '#e2e8f0',
                              color: '#475569',
                              fontWeight: 600,
                            }}
                          >
                            {option.tag}
                          </span>
                        )}
                      </div>
                      {option.subLabel && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {option.subLabel}
                        </span>
                      )}
                    </div>

                    <Check size={16} color="#10b981" style={{ opacity: 0 }} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {helperText && (
        <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
