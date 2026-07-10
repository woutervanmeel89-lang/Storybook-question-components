# Storybook Question Components

React component library voor interactieve oefenvragen. Het project bevat herbruikbare question components, Storybook stories, validatiehelpers en TypeScript types voor fill-in-the-blank en short-answer oefeningen.

## Wat zit erin?

- `QuestionPager`: complete oefenflow met voortgang, controle en herhaalronde voor foute antwoorden.
- `ShortAnswerQuestion`: open vraag met een tekstantwoord.
- `FillInTheBlankQuestion`: invulvraag met inline placeholders zoals `{preposition}`.
- `ReasoningField`: optioneel uitlegveld bij een vraag of bij een specifiek invulveld.
- Validatiehelpers: `validateQuestion`, `isAnswerReady`, `matchesAcceptedAnswer` en `normalizeAnswer`.

## Installatie

Installeer de package in een app via GitHub Packages:

```bash
npm install @woutervanmeel89-lang/storybook-question-components
```

Zet in de app die deze package gebruikt een `.npmrc` met:

```ini
@woutervanmeel89-lang:registry=https://npm.pkg.github.com
```

Voor private packages moet de installer ingelogd zijn met een GitHub token dat package-read rechten heeft.

Voor lokaal ontwikkelen in deze repo:

```bash
npm install
```

## Ontwikkelen

```bash
npm run dev
```

Start Storybook op poort `6006`.

## Controleren

```bash
npm run test:run
npm run lint
npm run build
```

## Gebruik in een app

Importeer de componenten en stylesheet vanuit de package:

```tsx
import {
  QuestionPager,
  type ExerciseQuestion,
} from '@woutervanmeel89-lang/storybook-question-components';
import '@woutervanmeel89-lang/storybook-question-components/style.css';

const questions: ExerciseQuestion[] = [
  {
    id: 'short-je-vais',
    type: 'short-answer',
    prompt: "Quelle est la traduction de 'ik ga' en francais ?",
    acceptedAnswers: ['je vais', "j'y vais"],
  },
];

export function Exercise() {
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

## Meer documentatie

- [Implementatiegids](./docs/implementation-guide.md): hoe je de library aansluit in een project.
- [Componenten en datamodel](./docs/component-api.md): props, question types en validatiegedrag.

## Publiceren naar GitHub Packages

Verhoog de versie in `package.json` en `package-lock.json`, bijvoorbeeld:

```bash
npm version patch
```

Push daarna naar `main` of `master`. De workflow `Publish package` draait automatisch wanneer `package.json` of `package-lock.json` wijzigt. De workflow test, bouwt en publiceert daarna deze package naar GitHub Packages met `GITHUB_TOKEN`.

Als dezelfde packageversie al bestaat, blijft de workflow groen en wordt er niets overschreven. Wil je een nieuwe installbare versie, verhoog dan altijd eerst de npm-versie.

Je kunt de workflow ook nog handmatig starten via Actions, of door een GitHub release te maken.

Bij een GitHub release uploadt de workflow ook een `.tgz` bestand als release asset. Dat bestand kan direct geinstalleerd worden vanuit een ander project, bijvoorbeeld:

```bash
npm install https://github.com/woutervanmeel89-lang/Storybook-question-components/releases/download/v0.1.2/woutervanmeel89-lang-storybook-question-components-0.1.2.tgz
```
