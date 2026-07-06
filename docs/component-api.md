# Componenten en datamodel

Deze pagina vat de publieke API samen die via `src/index.ts` wordt geexporteerd.

## Componenten

### QuestionPager

Complete oefenflow voor een lijst vragen.

```tsx
<QuestionPager questions={questions} />
```

Belangrijkste props:

- `questions`: lijst met `ExerciseQuestion`.
- `completionTitle`: titel wanneer alle vragen correct zijn beantwoord.
- `completionMessage`: bericht wanneer alle vragen correct zijn beantwoord.
- `feedbackCorrectTitle`: titel boven correcte feedback.
- `feedbackIncorrectTitle`: titel boven incorrecte feedback.
- `feedbackSolutionTitle`: titel boven de oplossing.
- `onClose`: optionele callback wanneer de gebruiker de flow afsluit nadat alle vragen juist zijn beantwoord.
- `className`: extra CSS class.

Gedrag:

- toont een vraag per keer;
- controleert antwoorden met `validateQuestion`;
- blokkeert de knop tot het antwoord ingevuld is;
- bewaart foute vragen en biedt die opnieuw aan na de eerste ronde;
- eindigt pas wanneer alle vragen correct zijn beantwoord.

### ShortAnswerQuestion

Losse component voor open vragen.

```tsx
<ShortAnswerQuestion
  question={question}
  answer={answer}
  onChange={setAnswer}
  validation={validation}
/>
```

Props:

- `question`: `ShortAnswerQuestionData`.
- `answer`: `ExerciseAnswer`.
- `onChange`: callback met het nieuwe antwoord.
- `validation`: optioneel resultaat van `validateQuestion`.
- `disabled`: zet inputvelden uit.
- `className`: extra CSS class.

### FillInTheBlankQuestion

Losse component voor invulvragen.

```tsx
<FillInTheBlankQuestion
  question={question}
  answer={answer}
  onChange={setAnswer}
  validation={validation}
/>
```

Props:

- `question`: `FillInTheBlankQuestionData`.
- `answer`: `ExerciseAnswer`.
- `onChange`: callback met het nieuwe antwoord.
- `validation`: optioneel resultaat van `validateQuestion`.
- `disabled`: zet inputvelden uit.
- `className`: extra CSS class.

Prompt placeholders zoals `{preposition}` worden inline inputs wanneer er een blank met hetzelfde id bestaat.

### FeedbackBox

Feedbackweergave voor een gecontroleerd antwoord.

```tsx
<FeedbackBox
  isCorrect={validation.isCorrect}
  message={message}
  solution={question.feedback.solution}
/>
```

Props:

- `isCorrect`: bepaalt correcte of incorrecte styling.
- `message`: feedbacktekst.
- `solution`: oplossing.
- `explanation`: optionele extra uitleg.
- `reasoningFeedback`: feedback voor het reasoning veld.
- `correctTitle`, `incorrectTitle`, `solutionTitle`: labels overschrijven.
- `className`: extra CSS class.

### Overige bouwstenen

- `TextInput`: basisinvoer met label en foutmelding.
- `ReasoningField`: uitlegveld voor vragen met `reasoning.enabled`.
- `NextButton`: knopcomponent voor pager-acties.
- `QuestionTypography`: typografiecomponent voor vraagtekst.

## Datamodel

### ExerciseQuestion

Union van:

- `ShortAnswerQuestionData`
- `FillInTheBlankQuestionData`

### ShortAnswerQuestionData

```ts
type ShortAnswerQuestionData = {
  id: string;
  type: 'short-answer';
  prompt: string;
  acceptedAnswers: string[];
  caseSensitive?: boolean;
  feedback: QuestionFeedback;
  reasoning?: ReasoningConfig;
};
```

### FillInTheBlankQuestionData

```ts
type FillInTheBlankQuestionData = {
  id: string;
  type: 'fill-in-the-blank';
  prompt: string;
  blanks: Array<{
    id: string;
    label?: string;
    acceptedAnswers: string[];
    caseSensitive?: boolean;
  }>;
  feedback: QuestionFeedback;
  reasoning?: ReasoningConfig;
};
```

### ExerciseAnswer

```ts
type ExerciseAnswer = {
  shortAnswer?: string;
  blanks?: Record<string, string>;
  reasoning?: string;
};
```

Voor `short-answer` gebruik je `shortAnswer`. Voor `fill-in-the-blank` gebruik je `blanks`, met de blank id als key.

### QuestionFeedback

```ts
type QuestionFeedback = {
  correct: string;
  incorrect: string;
  solution: string;
  explanation?: string;
};
```

### ReasoningConfig

```ts
type ReasoningConfig = {
  enabled: boolean;
  required?: boolean;
  prompt: string;
  acceptedAnswers?: string[];
  validationMode?: 'contains' | 'exact' | 'custom';
  caseSensitive?: boolean;
  customValidator?: (answer: string) => boolean;
  feedback?: {
    correct: string;
    incorrect: string;
    solution?: string;
  };
};
```

## Validatiehelpers

### validateQuestion

```ts
const result = validateQuestion(question, answer);
```

Geeft terug:

```ts
type QuestionValidationResult = {
  isCorrect: boolean;
  mainCorrect: boolean;
  reasoning: {
    enabled: boolean;
    isCorrect: boolean;
    message?: string;
  };
  fields: Record<string, {
    isCorrect: boolean;
    message?: string;
  }>;
};
```

### isAnswerReady

```ts
const ready = isAnswerReady(question, answer);
```

Geeft `true` wanneer de verplichte velden ingevuld zijn. Dit zegt nog niet of het antwoord correct is.

### matchesAcceptedAnswer

```ts
const matches = matchesAcceptedAnswer(answer, acceptedAnswers, {
  caseSensitive: false,
  mode: 'exact',
});
```

Ondersteunt `exact` en `contains`.

### normalizeAnswer

```ts
const normalized = normalizeAnswer(answer, false);
```

Trimt whitespace en maakt het antwoord lowercase wanneer `caseSensitive` uit staat.
