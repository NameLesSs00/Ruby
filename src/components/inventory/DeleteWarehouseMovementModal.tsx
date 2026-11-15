import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteModal } from '../ui/DeleteModal';
import { warehouseTransactionsApi, warehouseTransactionKeys, type WarehouseMovement } from '../../modules/warehouseTransactions';
import { inventoryKeys } from '../../modules/inventory';
import { productKeys } from '../../modules/products';
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
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: number) => warehouseTransactionsApi.delete(id),
    meta: { invalidate: [warehouseTransactionKeys.all, inventoryKeys.items(), productKeys.all] },
    onSuccess: async () => {
      showToast.success('تم حذف إذن الحركة المخزنية بنجاح');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: warehouseTransactionKeys.all }),
        queryClient.invalidateQueries({ queryKey: inventoryKeys.items() }),
        queryClient.invalidateQueries({ queryKey: productKeys.all }),
      ]);
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

