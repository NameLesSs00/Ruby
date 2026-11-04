import { useMutation } from '@tanstack/react-query';
import { DeleteModal } from '../ui/DeleteModal';
import { warehouseTransactionsApi, warehouseTransactionKeys, type WarehouseMovement } from '../../modules/warehouseTransactions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface DeleteWarehouseMovementModalProps {
  isOpen: boolean;
  movement: WarehouseMovement | null;
  onClose: () => void;
}

export const DeleteWarehouseMovementModal = ({
  isOpen,
  movement,
  onClose,
}: DeleteWarehouseMovementModalProps) => {
  const deleteMutation = useMutation({
    mutationFn: (id: number) => warehouseTransactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseTransactionKeys.all });
      showToast.success('تم حذف إذن الحركة المخزنية بنجاح');
      onClose();
    },
    onError: (err) => {
      showToast.apiError(err, 'فشل في حذف إذن الحركة المخزنية');
    },
  });

  if (!movement) return null;

  const typeLabel = movement.movementType === 'In' ? 'إذن التوريد (وارد)' : 'إذن الصرف (صادر)';

  return (
    <DeleteModal
      isOpen={isOpen}
      title="حذف إذن حركة مخزنية"
      message={`هل أنت متأكد من رغبتك في حذف ${typeLabel} رقم #${movement.movementGroupId}؟`}
      confirmLabel="نعم، حذف الإذن"
      isPending={deleteMutation.isPending}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutate(movement.movementGroupId)}
    />
  );
};

