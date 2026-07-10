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
      buttonLabels={{
        check: 'Verifiëren',
        close: 'Afsluiten',
        next: 'Verdergaan',
      }}
      completionTitle="Klaar"
      completionMessage="Alle vragen zijn juist beantwoord."
      emptyTitle="Geen vragen"
      emptyMessage="Er zijn geen oefeningen om te tonen."
      repeatRoundLabel="Herhaalronde"
    />
  );
}
```

`QuestionPager` doet zelf:

- huidige vraag bijhouden;
- antwoordstate per vraag bijhouden;
- controleren of een antwoord klaar is;
- valideren met `validateQuestion`;
- inline validatiefouten tonen;
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
    prompt: 'Explique pourquoi on utilise cette forme.',
    acceptedAnswers: ['a + le', 'contraction de a et le', 'a le devient au'],
    validationMode: 'contains',
  },
} satisfies ExerciseQuestion;
```

Reasoning ondersteunt drie validatiemodi:

- `exact`: de uitleg moet exact overeenkomen met een accepted answer.
- `contains`: de uitleg moet een accepted answer bevatten.
- `custom`: gebruik `customValidator` voor eigen logica.

Je kunt ook per invulveld een reasoning configureren. De gebruiker moet dan naast dat specifieke antwoord ook de redenering invullen:

```ts
const question = {
  id: 'participe-passe',
  type: 'fill-in-the-blank',
  prompt:
    'Ils etaient {hidden} dans un coin de la piece d ou ils pouvaient voir sans etre {seen}.',
  blanks: [
    {
      id: 'hidden',
      label: 'Participe passe 1',
      acceptedAnswers: ['cachés'],
      reasoning: {
        prompt: 'Raisonnement pour cachés',
        acceptedAnswers: ['accord avec le sujet', 'accord avec le sujet etre'],
        validationMode: 'contains',
      },
    },
    {
      id: 'seen',
      label: 'Participe passe 2',
      acceptedAnswers: ['vus'],
      reasoning: {
        prompt: 'Raisonnement pour vus',
        acceptedAnswers: [
          "l'infinitif prend le sujet du verbe principal",
          'ils',
        ],
        validationMode: 'contains',
      },
    },
  ],
} satisfies ExerciseQuestion;
```

In een eigen flow worden deze antwoorden opgeslagen in `answer.blankReasonings`, met dezelfde keys als de blank ids.

## 7. Maak content robuust

Aanbevolen afspraken voor implementatie:

- Gebruik stabiele, unieke `id` waarden. Deze worden gebruikt voor answer state en herhaalrondes.
- Zet alle mogelijke correcte varianten in `acceptedAnswers`.
- Gebruik `caseSensitive: true` alleen wanneer hoofdletters echt betekenis hebben.
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

