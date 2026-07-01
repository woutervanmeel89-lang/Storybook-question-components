import type { ExerciseQuestion } from '../../types/exercise';

export const shortAnswerQuestions: ExerciseQuestion[] = [
  {
    id: 'short-je-vais',
    type: 'short-answer',
    prompt: "Quelle est la traduction de 'ik ga' en francais ?",
    acceptedAnswers: ['je vais', "j'y vais"],
    feedback: {
      correct: 'Tres bien.',
      incorrect: 'Regarde encore le verbe aller.',
      solution: 'Je vais',
      explanation: "'Je vais' est la forme correcte de 'ik ga'.",
    },
  },
  {
    id: 'short-bonjour',
    type: 'short-answer',
    prompt: "Comment dit-on 'goedemorgen' en francais ?",
    acceptedAnswers: ['bonjour'],
    feedback: {
      correct: 'Exact.',
      incorrect: 'Pense a la salutation la plus courante.',
      solution: 'Bonjour',
    },
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
    feedback: {
      correct: 'Correct.',
      incorrect: 'Regarde la contraction avec le masculin singulier.',
      solution: 'Je vais au marche.',
      explanation: "'A' + 'le' devient 'au'.",
    },
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
    feedback: {
      correct: 'Bien joue.',
      incorrect: "Devant une voyelle, on utilise a l'.",
      solution: "Elle va a l'ecole.",
    },
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
    feedback: {
      correct: 'Correct.',
      incorrect: 'Controle le verbe aller et la preposition.',
      solution: 'Nous allons a la boulangerie apres l ecole.',
    },
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
      explanation: "'Professeur' est masculin singulier avec l'article 'le'.",
    },
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
    feedback: {
      correct: 'Correct.',
      incorrect: 'Le verbe manger correspond a eten.',
      solution: 'Ik eet',
    },
  },
  fillInTheBlankQuestions[0],
];
