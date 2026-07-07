import styles from './FeedbackBox.module.scss';
import type { FeedbackBoxProps } from './component.types';

export function FeedbackBox({
  className,
  correctTitle,
  explanation,
  incorrectTitle,
  isCorrect,
  message,
  reasoningAcceptedAnswersTitle,
  reasoningFeedback,
  reasoningSolutionTitle,
  reasoningTitle,
  solution,
  solutionTitle,
}: FeedbackBoxProps) {
  const classes = [
    styles.box,
    isCorrect ? styles.correct : styles.incorrect,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section aria-live="polite" className={classes}>
      <p className={styles.title}>{isCorrect ? correctTitle : incorrectTitle}</p>
      <p className={styles.message}>{message}</p>
      {solution ? (
        <p className={styles.solution}>
          <strong>{solutionTitle}:</strong>{' '}
          <span className={!isCorrect ? styles.solutionAnswer : undefined}>
            {solution}
          </span>
        </p>
      ) : null}
      {explanation ? <p className={styles.explanation}>{explanation}</p> : null}
      {reasoningFeedback && !reasoningFeedback.isCorrect ? (
        <div className={styles.reasoning}>
          {reasoningFeedback.acceptedAnswers?.length ? (
            <div className={styles.acceptedAnswers}>
              {reasoningAcceptedAnswersTitle ? (
                <p className={styles.acceptedAnswersTitle}>
                  {reasoningAcceptedAnswersTitle}
                </p>
              ) : null}
              <ul className={styles.acceptedAnswersList}>
                {reasoningFeedback.acceptedAnswers.map((answer) => (
                  <li className={styles.acceptedAnswer} key={answer}>
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.reasoningExplanation}>
            {reasoningTitle ? (
              <p className={styles.reasoningTitle}>{reasoningTitle}</p>
            ) : null}
            <p className={styles.message}>{reasoningFeedback.message}</p>
          </div>
          {reasoningFeedback.solution && reasoningSolutionTitle ? (
            <p className={styles.solution}>
              <strong>{reasoningSolutionTitle}:</strong>{' '}
              <span className={styles.solutionAnswer}>
                {reasoningFeedback.solution}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
