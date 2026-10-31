import { FolderKanban } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="empty-placeholder-card">
      <div className="placeholder-icon-wrap">
        <FolderKanban size={34} />
      </div>
      <h3 className="placeholder-title">{title}</h3>
      <p className="placeholder-desc">{description}</p>
      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
        الصفحة قيد التطوير حالياً
      </span>
    </div>
  );
};

