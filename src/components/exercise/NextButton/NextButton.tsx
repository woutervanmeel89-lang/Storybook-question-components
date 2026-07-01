import styles from './NextButton.module.scss';
import type { NextButtonProps } from './component.types';

export function NextButton({ children, className, type = 'button', ...props }: NextButtonProps) {
  const classes = [styles.button, className].filter(Boolean).join(' ');

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
