import { Award, Briefcase } from 'lucide-react';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { loadCoachOptions, loadEmployeeOptions } from './assignmentHelpers';

interface AssignmentStaffSectionProps {
  assigneeType: 'coach' | 'employee';
  onAssigneeTypeChange: (type: 'coach' | 'employee') => void;
  selectedStaff: SelectOption | null;
  onSelectedStaffChange: (staff: SelectOption | null) => void;
  disabled?: boolean;
}

export const AssignmentStaffSection = ({
  assigneeType,
  onAssigneeTypeChange,
  selectedStaff,
  onSelectedStaffChange,
  disabled = false,
}: AssignmentStaffSectionProps) => {
  return (
    <>
      {/* Assignee Type Switcher */}
      <div className="form-group">
        <label className="form-label required">نوع الكادر المعين</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => onAssigneeTypeChange('coach')}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${assigneeType === 'coach' ? '#F37023' : '#e2e8f0'}`,
              backgroundColor: assigneeType === 'coach' ? '#fff7ed' : '#ffffff',
              color: assigneeType === 'coach' ? '#c2410c' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Award size={16} />
            <span>مدرب أكاديمية</span>
          </button>

          <button
            type="button"
            onClick={() => onAssigneeTypeChange('employee')}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${assigneeType === 'employee' ? '#0284c7' : '#e2e8f0'}`,
              backgroundColor: assigneeType === 'employee' ? '#f0f9ff' : '#ffffff',
              color: assigneeType === 'employee' ? '#0369a1' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Briefcase size={16} />
            <span>موظف إشرافي</span>
          </button>
        </div>
      </div>

      {/* Staff Search Selector */}
      <div className="form-group">
        <label className="form-label required">
          {assigneeType === 'coach' ? 'اختر المدرب' : 'اختر الموظف'}
        </label>
        <AsyncSearchableSelect
          key={assigneeType}
          selectedItem={selectedStaff}
          onChange={onSelectedStaffChange}
          loadOptions={assigneeType === 'coach' ? loadCoachOptions : loadEmployeeOptions}
          placeholder={assigneeType === 'coach' ? 'ابحث بالاسم أو الهاتف...' : 'ابحث باسم الموظف أو المسمى...'}
          disabled={disabled}
        />
      </div>
    </>
  );
};
