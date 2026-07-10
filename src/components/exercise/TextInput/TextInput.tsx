import styles from './TextInput.module.scss';
import type { TextInputProps } from './component.types';

export function TextInput({
  className,
  disabled,
  errorMessage,
  id,
  isCorrect,
  label,
  onChange,
  value,
  ...inputProps
}: TextInputProps) {
  const inputId = id ?? inputProps.name ?? label;
  const errorId = `${inputId}-error`;
  const classes = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <span className={styles.inputWrapper}>
        <input
          {...inputProps}
          aria-describedby={errorMessage ? errorId : undefined}
          aria-invalid={Boolean(errorMessage)}
          className={styles.input}
          data-correct={isCorrect || undefined}
          disabled={disabled}
          id={inputId}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
        {isCorrect ? (
          <span
            aria-label="Correct antwoord"
            className={styles.correctIcon}
            role="img"
          />
        ) : null}
      </span>
      {errorMessage ? (
        <p className={styles.error} id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
