import { useState } from 'react';
import { Box, TextField, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FindReplaceInstruction } from '@/types';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';

interface ContentInstructionsProps {
  instructions: FindReplaceInstruction[];
  onAddInstruction: () => void;
  onUpdateInstruction: (id: string, field: 'find' | 'replace', value: string) => void;
  onRemoveInstruction: (id: string) => void;
}

/**
 * ContentInstructions component for managing find-and-replace instructions
 */
export const ContentInstructions = ({
  instructions,
  onAddInstruction,
  onUpdateInstruction,
  onRemoveInstruction,
}: ContentInstructionsProps) => {
  return (
    <Card title="Content Instructions">
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter text to find and replace in your document. You can add multiple find-and-replace pairs.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Find</TableCell>
              <TableCell>Replace</TableCell>
              <TableCell align="center" width="60px">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructions.map((instruction) => (
              <TableRow key={instruction.id}>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Text to find"
                    value={instruction.find}
                    onChange={(e) => onUpdateInstruction(instruction.id, 'find', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Text to replace with"
                    value={instruction.replace}
                    onChange={(e) => onUpdateInstruction(instruction.id, 'replace', e.target.value)}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onRemoveInstruction(instruction.id)}
                    disabled={instructions.length <= 1}
                    aria-label="remove instruction"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<AddIcon />}
          onClick={onAddInstruction}
          variant="outlined"
        >
          Add Row
        </Button>
      </Box>
    </Card>
  );
};
