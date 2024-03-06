import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('USerAccount', () => {
  it('should render user name to the screen', () => {
    const user: User = { id: 1, name: 'Amy' };
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
  it('should render edit button if user is an admin', () => {
    const user: User = { id: 2, name: 'Amy', isAdmin: true };
    render(<UserAccount user={user} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });
  it('should not render edit button if user is not an admin', () => {
    const user: User = { id: 3, name: 'Bob', isAdmin: false };
    render(<UserAccount user={user} />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });
});
