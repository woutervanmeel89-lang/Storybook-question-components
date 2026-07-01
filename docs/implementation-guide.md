# Implementatiegids

Deze gids beschrijft hoe je deze componentenbibliotheek gebruikt wanneer het project in een echte leerapp wordt geimplementeerd.

## 1. Kies de integratievorm

Er zijn twee logische manieren om de library te gebruiken:

- Als interne package binnen hetzelfde project.
- Als gepubliceerde of lokaal gelinkte npm package in een aparte app.

De build levert JavaScript, TypeScript declarations en CSS in `dist`. De package entrypoints staan in `package.json`:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  }
}
```

## 2. Installeer en importeer

In de consumer app moet React beschikbaar zijn. Deze library verwacht React als peer dependency.

```bash
npm install storybook-question-components
```

Gebruik daarna:

```tsx
import {
  QuestionPager,
  type ExerciseQuestion,
} from 'storybook-question-components';
import 'storybook-question-components/style.css';
```

## 3. Maak vraagdata

Alle vragen gebruiken hetzelfde basispatroon:

```ts
type BaseQuestion = {
  id: string;
  type: 'fill-in-the-blank' | 'short-answer';
  prompt: string;
  feedback: {
    correct: string;
    incorrect: string;
    solution: string;
    explanation?: string;
  };
};
```

Een short-answer vraag:

```ts
const question = {
  id: 'short-bonjour',
  type: 'short-answer',
  prompt: "Comment dit-on 'goedemorgen' en francais ?",
  acceptedAnswers: ['bonjour'],
  feedback: {
    correct: 'Exact.',
    incorrect: 'Pense a la salutation la plus courante.',
    solution: 'Bonjour',
  },
} satisfies ExerciseQuestion;
```

Een fill-in-the-blank vraag:

```ts
const question = {
  id: 'blank-marche',
  type: 'fill-in-the-blank',
  prompt: 'Je vais {preposition} marche.',
  blanks: [
    {
      id: 'preposition',
      label: 'Preposition',
      acceptedAnswers: ['au'],
    },
  ],
  feedback: {
    correct: 'Correct.',
    incorrect: 'Regarde la contraction avec le masculin singulier.',
    solution: 'Je vais au marche.',
    explanation: "'A' + 'le' devient 'au'.",
  },
} satisfies ExerciseQuestion;
```

De placeholder in `prompt` moet overeenkomen met een `blank.id`. Als je meerdere blanks gebruikt, geef elke blank een uniek id.

## 4. Gebruik de ingebouwde oefenflow

Voor de meeste implementaties is `QuestionPager` de snelste route:

```tsx
import { QuestionPager, type ExerciseQuestion } from 'storybook-question-components';
import 'storybook-question-components/style.css';

type ExercisePageProps = {
  questions: ExerciseQuestion[];
};

export function ExercisePage({ questions }: ExercisePageProps) {
  return (
    <QuestionPager
      questions={questions}
      completionTitle="Klaar"
      completionMessage="Alle vragen zijn juist beantwoord."
      feedbackCorrectTitle="Juist"
      feedbackIncorrectTitle="Nog niet juist"
      feedbackSolutionTitle="Oplossing"
    />
  );
}
```

`QuestionPager` doet zelf:

- huidige vraag bijhouden;
- antwoordstate per vraag bijhouden;
- controleren of een antwoord klaar is;
- valideren met `validateQuestion`;
- feedback tonen;
- foute vragen opnieuw aanbieden in een herhaalronde.

## 5. Bouw een eigen flow wanneer nodig

Als de app zelf navigatie, scoring of opslag regelt, gebruik dan de losse vraagcomponenten met de validatiehelpers.

```tsx
import { useState } from 'react';
import {
  ShortAnswerQuestion,
  validateQuestion,
  type ExerciseAnswer,
  type QuestionValidationResult,
  type ShortAnswerQuestionData,
} from 'storybook-question-components';

type Props = {
  question: ShortAnswerQuestionData;
};

export function CustomQuestion({ question }: Props) {
  const [answer, setAnswer] = useState<ExerciseAnswer>({ shortAnswer: '' });
  const [validation, setValidation] = useState<QuestionValidationResult>();

  return (
    <>
      <ShortAnswerQuestion
        question={question}
        answer={answer}
        onChange={setAnswer}
        validation={validation}
        disabled={Boolean(validation)}
      />
      <button onClick={() => setValidation(validateQuestion(question, answer))}>
        Controleren
      </button>
    </>
  );
}
```

## 6. Voeg uitlegvalidatie toe

Vragen kunnen optioneel een reasoning veld tonen:

```ts
const question = {
  id: 'reasoning-professeur',
  type: 'fill-in-the-blank',
  prompt: 'Je parle {preposition} professeur.',
  blanks: [
    {
      id: 'preposition',
      label: 'Preposition',
      acceptedAnswers: ['au'],
    },
  ],
  reasoning: {
    enabled: true,
    required: true,
    prompt: 'Explique pourquoi on utilise cette forme.',
    acceptedAnswers: ['a + le', 'contraction de a et le', 'a le devient au'],
    validationMode: 'contains',
    feedback: {
      correct: 'Ton explication est correcte.',
      incorrect: 'Mentionne la contraction de a et le.',
      solution: 'A + le devient au.',
    },
  },
  feedback: {
    correct: 'Correct.',
    incorrect: 'La preposition doit etre contractee.',
    solution: 'Je parle au professeur.',
  },
} satisfies ExerciseQuestion;
```

Reasoning ondersteunt drie validatiemodi:

- `exact`: de uitleg moet exact overeenkomen met een accepted answer.
- `contains`: de uitleg moet een accepted answer bevatten.
- `custom`: gebruik `customValidator` voor eigen logica.

## 7. Maak content robuust

Aanbevolen afspraken voor implementatie:

- Gebruik stabiele, unieke `id` waarden. Deze worden gebruikt voor answer state en herhaalrondes.
- Zet alle mogelijke correcte varianten in `acceptedAnswers`.
- Gebruik `caseSensitive: true` alleen wanneer hoofdletters echt betekenis hebben.
- Houd feedback kort: `incorrect` helpt bij de volgende poging, `solution` toont het juiste antwoord.
- Voeg `explanation` toe wanneer de app ook leereffect na feedback moet tonen.
- Gebruik Storybook stories om nieuwe vraagtypes en edge cases te controleren.

## 8. Test voor oplevering

Gebruik deze checks voordat je de library in een app gebruikt of publiceert:

```bash
npm run test:run
npm run lint
npm run build
npm run build-storybook
```

Controleer in Storybook minimaal:

- een short-answer vraag;
- een fill-in-the-blank vraag met een inline blank;
- een vraag met meerdere blanks;
- een vraag met reasoning;
- een volledig `QuestionPager` scenario met een fout antwoord en herhaalronde.

