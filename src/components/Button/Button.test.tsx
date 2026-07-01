import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders the button label', () => {
    render(<Button>Save changes</Button>);

    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save changes</Button>);

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
