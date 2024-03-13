import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  it('should render a list of tags', async () => {
    render(<TagList />);

    // Two versions of the same thing, the second one preferred

    // the waitFor calls the callback until it times out
    // await waitFor(() => {
    //   const listitems = screen.getAllByRole('listitem');
    //   expect(listitems.length).toBeGreaterThan(0);
    // });

    const listitems = await screen.findAllByRole('listitem');
    expect(listitems.length).toBeGreaterThan(0);
  });
});
