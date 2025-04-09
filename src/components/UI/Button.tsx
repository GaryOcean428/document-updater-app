import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
}

/**
 * Custom Button component that wraps Material UI Button
 */
export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      {...props}
    >
      {children}
    </MuiButton>
  );
};
