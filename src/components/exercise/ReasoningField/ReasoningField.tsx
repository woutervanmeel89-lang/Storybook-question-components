import { TextInput } from '../TextInput';
import styles from './ReasoningField.module.scss';
import type { ReasoningFieldProps } from './component.types';

export function ReasoningField({
  className,
  disabled,
  onChange,
  reasoning,
  validation,
  value,
}: ReasoningFieldProps) {
  if (!reasoning.enabled) {
    return null;
  }

  const classes = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <TextInput
        errorMessage={validation?.isCorrect === false ? validation.message : undefined}
        label={reasoning.prompt}
        onChange={onChange}
        placeholder="Écris ton explication"
        value={value}
        disabled={disabled}
      />
    </div>
  );
}
