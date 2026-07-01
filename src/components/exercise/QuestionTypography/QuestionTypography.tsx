import styles from './QuestionTypography.module.scss';
import type { QuestionTypographyProps } from './component.types';

export function QuestionTypography({
  children,
  className,
  eyebrow,
}: QuestionTypographyProps) {
  const classes = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.prompt}>{children}</h2>
    </div>
  );
}
