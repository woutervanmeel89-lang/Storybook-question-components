import styles from './FeedbackBox.module.scss';
import type { FeedbackBoxProps } from './component.types';

export function FeedbackBox({
  className,
  correctTitle = 'Juist',
  explanation,
  incorrectTitle = 'Nog niet juist',
  isCorrect,
  message,
  reasoningFeedback,
  solution,
  solutionTitle = 'Oplossing',
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
          <strong>{solutionTitle}:</strong> {solution}
        </p>
      ) : null}
      {explanation ? <p className={styles.explanation}>{explanation}</p> : null}
      {reasoningFeedback && !reasoningFeedback.isCorrect ? (
        <div className={styles.reasoning}>
          {reasoningFeedback.acceptedAnswers?.length ? (
            <div className={styles.acceptedAnswers}>
              <p className={styles.acceptedAnswersTitle}>Geaccepteerde antwoorden</p>
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
            <p className={styles.reasoningTitle}>Extra uitleg</p>
            <p className={styles.message}>{reasoningFeedback.message}</p>
          </div>
          {reasoningFeedback.solution ? (
            <p className={styles.solution}>
              <strong>Voorbeeld:</strong> {reasoningFeedback.solution}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
