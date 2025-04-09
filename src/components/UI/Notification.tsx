import { Alert, AlertProps, Snackbar } from '@mui/material';
import { ReactNode } from 'react';

interface NotificationProps extends Omit<AlertProps, 'children'> {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  autoHideDuration?: number;
}

/**
 * Notification component for displaying alerts and messages
 */
export const Notification = ({
  open,
  message,
  onClose,
  autoHideDuration = 6000,
  severity = 'info',
  ...props
}: NotificationProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} {...props}>
        {message}
      </Alert>
    </Snackbar>
  );
};
