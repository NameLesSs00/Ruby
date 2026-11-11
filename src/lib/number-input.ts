/**
 * Helpers for money and numeric-only input fields across Ruby Swimming Academy.
 * Prevents non-numeric characters (scientific notation 'e', signs '+', '-') and ensures
 * valid positive numeric entries.
 */
import type { KeyboardEvent } from 'react';

/**
 * Event handler for onKeyDown on numeric inputs.
 * Blocks 'e', 'E', '+', '-' so users can only type digits and decimal points.
 */
export const blockInvalidNumberKeys = (e: KeyboardEvent<HTMLInputElement>) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Sanitizes input string to contain only valid digits and at most one decimal point.
 */
export const sanitizeNumericInput = (val: string): string => {
  return val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
};

