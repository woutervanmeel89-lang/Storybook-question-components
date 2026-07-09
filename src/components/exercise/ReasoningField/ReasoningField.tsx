import { TextInput } from '../TextInput';
import styles from './ReasoningField.module.scss';
import type { ReasoningFieldProps } from './component.types';

export function ReasoningField({
  className,
  disabled,
  id,
  onChange,
  reasoning,
  validation,
  value,
}: ReasoningFieldProps) {
  const classes = [styles.wrapper, className].filter(Boolean).join(' ');
  const solutionMessage = <strong>{reasoning.acceptedAnswers.join(' / ')}</strong>;

  return (
    <div className={classes}>
      <TextInput
        errorMessage={
          validation?.isCorrect === false ? solutionMessage : undefined
        }
        id={id}
        label={reasoning.prompt}
        onChange={onChange}
        placeholder="Écris ton explication"
        value={value}
        disabled={disabled}
      />
    </div>
  );
}
