import type { ReactNode } from 'react';

export interface SummaryCardItem {
  id: string;
  label: string;
  value: number | string;
  subValue?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

interface ReportSummaryCardsProps {
  cards: SummaryCardItem[];
}

export const ReportSummaryCards = ({ cards }: ReportSummaryCardsProps) => {
  const getVariantStyles = (variant: SummaryCardItem['variant'] = 'neutral') => {
    switch (variant) {
      case 'primary':
        return {
          border: '1px solid #fed7aa',
          bg: '#fff7ed',
          textColor: '#c2410c',
          iconBg: '#ffedd5',
        };
      case 'success':
        return {
          border: '1px solid #bbf7d0',
          bg: '#f0fdf4',
          textColor: '#15803d',
          iconBg: '#dcfce7',
        };
      case 'warning':
        return {
          border: '1px solid #fef08a',
          bg: '#fefce8',
          textColor: '#a16207',
          iconBg: '#fef9c3',
        };
      case 'danger':
        return {
          border: '1px solid #fecaca',
          bg: '#fef2f2',
          textColor: '#b91c1c',
          iconBg: '#fee2e2',
        };
      case 'info':
        return {
          border: '1px solid #bae6fd',
          bg: '#f0f9ff',
          textColor: '#0369a1',
          iconBg: '#e0f2fe',
        };
      case 'neutral':
      default:
        return {
          border: '1px solid #e2e8f0',
          bg: '#ffffff',
          textColor: '#0f172a',
          iconBg: '#f1f5f9',
        };
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {cards.map((card) => {
        const styles = getVariantStyles(card.variant);
        return (
          <div
            key={card.id}
            style={{
              background: styles.bg,
              border: styles.border,
              borderRadius: '0.75rem',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: '0.375rem',
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: styles.textColor,
                  lineHeight: 1.2,
                }}
              >
                {typeof card.value === 'number' ? card.value.toLocaleString('en-US') : card.value}
              </p>
              {card.subValue && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginTop: '0.25rem',
                  }}
                >
                  {card.subValue}
                </p>
              )}
            </div>

            {card.icon && (
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.5rem',
                  background: styles.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: styles.textColor,
                }}
              >
                {card.icon}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
