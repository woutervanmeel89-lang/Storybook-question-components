import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ReasoningField } from './ReasoningField';

const meta = {
  title: 'Exercise/ReasoningField',
  component: ReasoningField,
  tags: ['autodocs'],
} satisfies Meta<typeof ReasoningField>;

export default meta;

type Story = StoryObj<typeof meta>;

function ReasoningFieldExample() {
  const [value, setValue] = useState('');

  return (
    <ReasoningField
      onChange={setValue}
      reasoning={{
        prompt: 'Explique pourquoi on utilise cette forme.',
        acceptedAnswers: ['a + le', 'contraction de a et le', 'a le devient au'],
      }}
      value={value}
    />
  );
}

export const Default: Story = {
  render: () => <ReasoningFieldExample />,
};
