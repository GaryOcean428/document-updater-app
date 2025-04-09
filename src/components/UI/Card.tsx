import { Paper, Typography, Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface CardProps extends BoxProps {
  title?: string;
  children: ReactNode;
}

/**
 * Card component for containing sections of the application
 */
export const Card = ({ title, children, ...props }: CardProps) => {
  return (
    <Box {...props}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          height: '100%'
        }}
      >
        {title && (
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Paper>
    </Box>
  );
};
