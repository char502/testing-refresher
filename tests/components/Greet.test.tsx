import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('group', () => {
  it('should render Hello with the name when name is provided', () => {
    render(<Greet name="Bob" />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Hello Bob/i);
  });

  it('should render a login button when the name is not provided', () => {
    render(<Greet />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Login/i);
  });
});
