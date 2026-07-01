import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextInput } from './TextInput';

const meta = {
  title: 'Exercise/TextInput',
  component: TextInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

function TextInputExample() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      label="Reponse"
      onChange={setValue}
      placeholder="Ecris ta reponse"
      value={value}
    />
  );
}

export const Default: Story = {
  render: () => <TextInputExample />,
};

export const WithError: Story = {
  render: () => (
    <TextInput
      errorMessage="Ce champ est obligatoire."
      label="Reponse"
      onChange={() => undefined}
      value=""
    />
  ),
};
