import { useState, useCallback } from 'react';
import { FindReplaceInstruction } from '@/types';
import { generateId } from '@/utils/helpers';

interface UseContentInstructionsReturn {
  instructions: FindReplaceInstruction[];
  addInstruction: () => void;
  updateInstruction: (id: string, field: 'find' | 'replace', value: string) => void;
  removeInstruction: (id: string) => void;
}

/**
 * Custom hook for managing content instructions (find-and-replace pairs)
 */
export const useContentInstructions = (): UseContentInstructionsReturn => {
  const [instructions, setInstructions] = useState<FindReplaceInstruction[]>([
    { id: generateId(), find: '', replace: '' }
  ]);

  const addInstruction = useCallback(() => {
    setInstructions(prev => [
      ...prev,
      { id: generateId(), find: '', replace: '' }
    ]);
  }, []);

  const updateInstruction = useCallback((id: string, field: 'find' | 'replace', value: string) => {
    setInstructions(prev => 
      prev.map(instruction => 
        instruction.id === id 
          ? { ...instruction, [field]: value } 
          : instruction
      )
    );
  }, []);

  const removeInstruction = useCallback((id: string) => {
    setInstructions(prev => {
      // Don't remove if it's the last instruction
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter(instruction => instruction.id !== id);
    });
  }, []);

  return {
    instructions,
    addInstruction,
    updateInstruction,
    removeInstruction
  };
};
