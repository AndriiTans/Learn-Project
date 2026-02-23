import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={() => onOpenChange(false)} disabled={loading}>
          {cancelText}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
