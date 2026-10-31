import { useQuery } from '@tanstack/react-query';
import { employeesApi, type Employee } from '../../modules/employees';

interface EmployeeNameCellProps {
  employeeId: number;
  fallbackEmployees?: Employee[];
}

export const EmployeeNameCell = ({
  employeeId,
  fallbackEmployees = [],
}: EmployeeNameCellProps) => {
  // 1. Check if already found in preloaded employees list
  const found = fallbackEmployees.find(
    (e) => Number(e.id) === Number(employeeId)
  );

  // 2. If not found in list, fetch on-demand from employees endpoint
  const { data: fetchedName, isLoading } = useQuery({
    queryKey: ['employee-name-lookup', employeeId],
    queryFn: async () => {
      try {
        const emp = await employeesApi.getById(Number(employeeId));
        if (emp?.fullName) return emp.fullName;
      } catch {
        // Not found
      }
      return null;
    },
    enabled: !found && !!employeeId,
    staleTime: 10 * 60 * 1000,
  });

  const displayName = found?.fullName || fetchedName || (isLoading ? 'جاري التحميل...' : 'موظف غير محدد');
  const avatarChar = displayName.replace(/^[^a-zA-Z\u0600-\u06FF]+/, '').charAt(0) || 'م';

  return (
    <div className="coach-cell-name">
      <div className="coach-avatar">
        {avatarChar}
      </div>
      <span style={{ fontWeight: 600 }}>{displayName}</span>
    </div>
  );
};

