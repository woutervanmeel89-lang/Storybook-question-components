import type { InputHTMLAttributes, ReactNode } from 'react';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: ReactNode;
}
