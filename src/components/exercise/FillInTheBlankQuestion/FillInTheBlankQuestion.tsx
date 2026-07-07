import { QuestionTypography } from '../QuestionTypography';
import { ReasoningField } from '../ReasoningField';
import { TextInput } from '../TextInput';
import styles from './FillInTheBlankQuestion.module.scss';
import type { FillInTheBlankQuestionProps } from './component.types';

type PromptPart =
  | { type: 'text'; value: string }
  | { type: 'blank'; blankId: string };

function getPromptParts(prompt: string, blankIds: string[]) {
  const parts: PromptPart[] = [];
  const placeholderPattern = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let nextBlankIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = placeholderPattern.exec(prompt)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: prompt.slice(lastIndex, match.index) });
    }

    const placeholder = match[1]?.trim();
    const blankId =
      placeholder === 'blank' || placeholder === 'blanks'
        ? blankIds[nextBlankIndex]
        : placeholder;

    if (blankId && blankIds.includes(blankId)) {
      parts.push({ type: 'blank', blankId });
      nextBlankIndex += 1;
    } else {
      parts.push({ type: 'text', value: match[0] });
    }

    lastIndex = placeholderPattern.lastIndex;
  }

  if (lastIndex < prompt.length) {
    parts.push({ type: 'text', value: prompt.slice(lastIndex) });
  }

  return parts;
}

export function FillInTheBlankQuestion({
  answer,
  className,
  disabled,
  onChange,
  question,
  solutionTitle,
  validation,
}: FillInTheBlankQuestionProps) {
  const classes = [styles.question, className].filter(Boolean).join(' ');
  const blankIds = question.blanks.map((blank) => blank.id);
  const promptParts = getPromptParts(question.prompt, blankIds);
  const renderedInlineBlankIds = new Set(
    promptParts
      .filter((part): part is { type: 'blank'; blankId: string } => part.type === 'blank')
      .map((part) => part.blankId),
  );
  const hasInlineBlanks = renderedInlineBlankIds.size > 0;
  const hasInlineBlankReasonings = question.blanks.some(
    (blank) => renderedInlineBlankIds.has(blank.id) && blank.reasoning?.enabled,
  );

  function updateBlank(blankId: string, value: string) {
    onChange({
      ...answer,
      blanks: {
        ...answer.blanks,
        [blankId]: value,
      },
    });
  }

  function updateBlankReasoning(blankId: string, value: string) {
    onChange({
      ...answer,
      blankReasonings: {
        ...answer.blankReasonings,
        [blankId]: value,
      },
    });
  }

  function getBlankReasoningField(blank: (typeof question.blanks)[number]) {
    if (!blank.reasoning?.enabled) {
      return null;
    }

    return (
      <ReasoningField
        disabled={disabled}
        errorMessage={blank.reasoning.feedback?.incorrect}
        id={`${question.id}-${blank.id}-reasoning`}
        key={`${blank.id}-reasoning`}
        onChange={(reasoning) => updateBlankReasoning(blank.id, reasoning)}
        reasoning={blank.reasoning}
        validation={validation?.blankReasonings[blank.id]}
        value={answer.blankReasonings?.[blank.id] ?? ''}
      />
    );
  }

  function getBlankSolutionMessage(blank: (typeof question.blanks)[number]) {
    return validation?.fields[blank.id]?.isCorrect === false ? (
      <>
        {solutionTitle}: <strong>{blank.acceptedAnswers.join(' / ')}</strong>
      </>
    ) : undefined;
  }

  return (
    <div className={classes}>
      <QuestionTypography eyebrow="Exercice a trous">
        {hasInlineBlanks ? (
          <span className={styles.inlinePrompt}>
            {promptParts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={`${part.value}-${index}`}>{part.value}</span>;
              }

              const blank = question.blanks.find(
                (questionBlank) => questionBlank.id === part.blankId,
              );

              if (!blank) {
                return null;
              }

              const inputId = `${question.id}-${blank.id}`;
              const errorId = `${inputId}-error`;
              const solutionMessage = getBlankSolutionMessage(blank);

              return (
                <span className={styles.inlineBlank} key={blank.id}>
                  <label className={styles.visuallyHidden} htmlFor={inputId}>
                    {blank.label ?? `Reponse ${index + 1}`}
                  </label>
                  <input
                    aria-describedby={
                      solutionMessage ? errorId : undefined
                    }
                    aria-invalid={Boolean(solutionMessage)}
                    className={styles.inlineInput}
                    disabled={disabled}
                    id={inputId}
                    onChange={(event) => updateBlank(blank.id, event.target.value)}
                    value={answer.blanks?.[blank.id] ?? ''}
                  />
                </span>
              );
            })}
          </span>
        ) : (
          question.prompt
        )}
      </QuestionTypography>

      {hasInlineBlanks ? (
        <div className={styles.inlineErrors}>
          {question.blanks
            .filter((blank) => renderedInlineBlankIds.has(blank.id))
            .map((blank) => {
              const solutionMessage = getBlankSolutionMessage(blank);

              return solutionMessage ? (
                <p
                  className={styles.error}
                  id={`${question.id}-${blank.id}-error`}
                  key={blank.id}
                  role="alert"
                >
                  {blank.label ?? blank.id}: {solutionMessage}
                </p>
              ) : null;
            })}
        </div>
      ) : null}

      {hasInlineBlankReasonings ? (
        <div className={styles.blankReasonings}>
          {question.blanks
            .filter((blank) => renderedInlineBlankIds.has(blank.id))
            .map((blank) => getBlankReasoningField(blank))}
        </div>
      ) : null}

      <div className={styles.blanks}>
        {question.blanks
          .filter((blank) => !renderedInlineBlankIds.has(blank.id))
          .map((blank, index) => (
            <div className={styles.blankGroup} key={blank.id}>
              <TextInput
                disabled={disabled}
                errorMessage={getBlankSolutionMessage(blank)}
                label={blank.label ?? `Reponse ${index + 1}`}
                onChange={(value) => updateBlank(blank.id, value)}
                placeholder="Complete"
                value={answer.blanks?.[blank.id] ?? ''}
              />
              {getBlankReasoningField(blank)}
            </div>
          ))}
      </div>

      {question.reasoning?.enabled ? (
        <ReasoningField
          disabled={disabled}
          onChange={(reasoning) => onChange({ ...answer, reasoning })}
          reasoning={question.reasoning}
          validation={validation?.reasoning}
          value={answer.reasoning ?? ''}
        />
      ) : null}
    </div>
  );
}
