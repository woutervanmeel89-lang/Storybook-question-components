import { useMemo, useState } from 'react';
import type {
  ExerciseAnswer,
  ExerciseQuestion,
  QuestionValidationResult,
} from '../../../types/exercise';
import { isAnswerReady, validateQuestion } from '../../../utils';
import { FeedbackBox } from '../FeedbackBox';
import { FillInTheBlankQuestion } from '../FillInTheBlankQuestion';
import { NextButton } from '../NextButton';
import { ShortAnswerQuestion } from '../ShortAnswerQuestion';
import styles from './QuestionPager.module.scss';
import type { QuestionPagerProps } from './component.types';

type AnswerState = Record<string, ExerciseAnswer>;

function emptyAnswer(question: ExerciseQuestion): ExerciseAnswer {
  if (question.type === 'fill-in-the-blank') {
    return {
      blanks: Object.fromEntries(question.blanks.map((blank) => [blank.id, ''])),
    };
  }

  return { shortAnswer: '' };
}

function getReasoningFeedback(
  question: ExerciseQuestion,
  validation: QuestionValidationResult,
) {
  if (!question.reasoning?.enabled) {
    return undefined;
  }

  const feedback = question.reasoning.feedback;
  const isCorrect = validation.reasoning.isCorrect;

  return {
    isCorrect,
    acceptedAnswers: isCorrect ? undefined : question.reasoning.acceptedAnswers,
    message:
      (isCorrect ? feedback?.correct : feedback?.incorrect) ??
      (isCorrect ? 'De uitleg is juist.' : 'De uitleg is nog niet juist.'),
    solution: feedback?.solution,
  };
}

function formatAcceptedAnswers(acceptedAnswers: string[]) {
  return acceptedAnswers.join(' / ');
}

function getFeedbackSolution(
  question: ExerciseQuestion,
  validation: QuestionValidationResult,
) {
  if (validation.mainCorrect) {
    return undefined;
  }

  if (question.type === 'short-answer') {
    return formatAcceptedAnswers(question.acceptedAnswers);
  }

  return question.blanks
    .filter((blank) => !validation.fields[blank.id]?.isCorrect)
    .map((blank) => {
      const label = blank.label ?? blank.id;
      return `${label}: ${formatAcceptedAnswers(blank.acceptedAnswers)}`;
    })
    .join('; ');
}

export function QuestionPager({
  className,
  completionMessage = 'Alle vragen zijn juist beantwoord.',
  completionTitle = 'Klaar',
  feedbackCorrectTitle = 'Juist',
  feedbackIncorrectTitle = 'Nog niet juist',
  feedbackSolutionTitle = 'Oplossing',
  onClose,
  questions,
}: QuestionPagerProps) {
  const [roundQuestions, setRoundQuestions] = useState<ExerciseQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [validation, setValidation] = useState<QuestionValidationResult>();
  const [incorrectIds, setIncorrectIds] = useState<Set<string>>(() => new Set());
  const [isRepeatRound, setIsRepeatRound] = useState(false);
  const [isComplete, setIsComplete] = useState(questions.length === 0);

  const currentQuestion = roundQuestions[currentIndex];
  const currentAnswer = useMemo(() => {
    if (!currentQuestion) {
      return {};
    }

    return answers[currentQuestion.id] ?? emptyAnswer(currentQuestion);
  }, [answers, currentQuestion]);

  if (isComplete) {
    return (
      <section className={[styles.pager, className].filter(Boolean).join(' ')}>
        <div className={styles.completion} role="status">
          <h2>{completionTitle}</h2>
          <p>{completionMessage}</p>
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className={[styles.pager, className].filter(Boolean).join(' ')}>
        <div className={styles.completion} role="status">
          <h2>Geen vragen</h2>
          <p>Er zijn geen oefeningen om te tonen.</p>
        </div>
      </section>
    );
  }

  const isLastQuestion = currentIndex === roundQuestions.length - 1;
  const buttonLabel = showFeedback
    ? isLastQuestion
      ? 'Afsluiten'
      : 'Volgende'
    : 'Controleren';

  function updateAnswer(answer: ExerciseAnswer) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: answer,
    }));
  }

  function submitAnswer() {
    const result = validateQuestion(currentQuestion, currentAnswer);
    setValidation(result);
    setShowFeedback(true);

    if (!result.isCorrect) {
      setIncorrectIds((currentIds) => new Set(currentIds).add(currentQuestion.id));
    }
  }

  function goToNextQuestion() {
    setValidation(undefined);
    setShowFeedback(false);

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    if (incorrectIds.size > 0) {
      const retryQuestionsForNextRound = questions.filter((question) =>
        incorrectIds.has(question.id),
      );

      setRoundQuestions(retryQuestionsForNextRound);
      setAnswers((currentAnswers) => {
        const nextAnswers = { ...currentAnswers };
        retryQuestionsForNextRound.forEach((question) => {
          nextAnswers[question.id] = emptyAnswer(question);
        });
        return nextAnswers;
      });
      setIncorrectIds(new Set());
      setCurrentIndex(0);
      setIsRepeatRound(true);
      return;
    }

    onClose?.();
    setIsComplete(true);
  }

  function handleButtonClick() {
    if (showFeedback) {
      goToNextQuestion();
      return;
    }

    submitAnswer();
  }

  const ready = isAnswerReady(currentQuestion, currentAnswer);
  const progressText = `${currentIndex + 1} van ${roundQuestions.length}`;
  const feedbackMessage = validation?.isCorrect
    ? currentQuestion.feedback.correct
    : currentQuestion.feedback.incorrect;
  const feedbackSolution = validation
    ? getFeedbackSolution(currentQuestion, validation)
    : undefined;

  return (
    <section className={[styles.pager, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <p className={styles.progress}>{progressText}</p>
        {isRepeatRound ? <p className={styles.repeat}>Herhaalronde</p> : null}
      </header>

      <div className={styles.body}>
        {currentQuestion.type === 'short-answer' ? (
          <ShortAnswerQuestion
            answer={currentAnswer}
            disabled={showFeedback}
            onChange={updateAnswer}
            question={currentQuestion}
            validation={showFeedback ? validation : undefined}
          />
        ) : (
          <FillInTheBlankQuestion
            answer={currentAnswer}
            disabled={showFeedback}
            onChange={updateAnswer}
            question={currentQuestion}
            validation={showFeedback ? validation : undefined}
          />
        )}

        {showFeedback && validation ? (
          <FeedbackBox
            correctTitle={feedbackCorrectTitle}
            explanation={currentQuestion.feedback.explanation}
            incorrectTitle={feedbackIncorrectTitle}
            isCorrect={validation.isCorrect}
            message={feedbackMessage}
            reasoningFeedback={getReasoningFeedback(currentQuestion, validation)}
            solution={feedbackSolution}
            solutionTitle={feedbackSolutionTitle}
          />
        ) : null}
      </div>

      <footer className={styles.footer}>
        <NextButton disabled={!showFeedback && !ready} onClick={handleButtonClick}>
          {buttonLabel}
        </NextButton>
      </footer>
    </section>
  );
}
