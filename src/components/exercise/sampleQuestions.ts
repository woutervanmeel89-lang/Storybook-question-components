import type { ExerciseQuestion } from '../../types/exercise';

export const shortAnswerQuestions: ExerciseQuestion[] = [
  {
    id: 'short-je-vais',
    type: 'short-answer',
    prompt: "Quelle est la traduction de 'ik ga' en francais ?",
    acceptedAnswers: ['je vais', "j'y vais"],
  },
  {
    id: 'short-bonjour',
    type: 'short-answer',
    prompt: "Comment dit-on 'goedemorgen' en francais ?",
    acceptedAnswers: ['bonjour'],
  },
];

export const fillInTheBlankQuestions: ExerciseQuestion[] = [
  {
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
  },
  {
    id: 'blank-ecole',
    type: 'fill-in-the-blank',
    prompt: 'Elle va {preposition} ecole.',
    blanks: [
      {
        id: 'preposition',
        label: 'Preposition',
        acceptedAnswers: ["a l'", 'a l’'],
      },
    ],
  },
];

export const multipleBlankQuestions: ExerciseQuestion[] = [
  {
    id: 'blank-multiple',
    type: 'fill-in-the-blank',
    prompt: 'Nous {verb} {preposition} boulangerie apres l ecole.',
    blanks: [
      {
        id: 'verb',
        label: 'Verbe',
        acceptedAnswers: ['allons'],
      },
      {
        id: 'preposition',
        label: 'Preposition',
        acceptedAnswers: ['a la'],
      },
    ],
  },
];

export const reasoningQuestions: ExerciseQuestion[] = [
  {
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
  },
];

export const blankReasoningQuestions: ExerciseQuestion[] = [
  {
    id: 'blank-reasoning-participe-passe',
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
  },
];

export const mixedQuestions: ExerciseQuestion[] = [
  shortAnswerQuestions[0],
  fillInTheBlankQuestions[0],
  reasoningQuestions[0],
];

export const retryQuestions: ExerciseQuestion[] = [
  {
    id: 'retry-short',
    type: 'short-answer',
    prompt: "Quelle est la traduction de 'je mange' en neerlandais ?",
    acceptedAnswers: ['ik eet'],
  },
  fillInTheBlankQuestions[0],
];

export const textSelectionQuestions: ExerciseQuestion[] = [
  {
    id: 'selection-discours-indirect',
    type: 'text-selection',
    prompt: 'Sélectionnez les phrases au discours indirect.',
    selectionUnit: 'sentence',
    options: [
      { id: 'phrase-1', text: 'Il me dit qu’il ne veut pas y aller.' },
      { id: 'phrase-2', text: 'J’ai peur, dit-elle.' },
      { id: 'phrase-3', text: 'Elle prétend qu’elle n’a rien entendu.' },
      { id: 'phrase-4', text: 'Je t’ai dit de ne pas mentir.' },
      {
        id: 'phrase-5',
        text: 'Le médecin a dit qu’il essaierait de sauver le blessé.',
      },
      {
        id: 'phrase-6',
        text: 'Ne pars pas encore, dit-elle, j’ai encore quelque chose à te raconter.',
      },
    ],
    correctOptionIds: ['phrase-1', 'phrase-3', 'phrase-4', 'phrase-5'],
  },
];

