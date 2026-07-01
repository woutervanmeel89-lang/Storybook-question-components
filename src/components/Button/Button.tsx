import styles from './Button.module.scss';
import type { ButtonProps } from './component.types';

export function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
