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
        enabled: true,
        required: true,
        prompt: 'Explique pourquoi on utilise cette forme.',
      }}
      value={value}
    />
  );
}

export const Default: Story = {
  render: () => <ReasoningFieldExample />,
};
