import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface NextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
