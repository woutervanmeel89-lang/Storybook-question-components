import type { Meta, StoryObj } from '@storybook/react-vite';
import { NextButton } from './NextButton';

const meta = {
  title: 'Exercise/NextButton',
  component: NextButton,
  tags: ['autodocs'],
  args: {
    children: 'Controleren',
  },
} satisfies Meta<typeof NextButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
