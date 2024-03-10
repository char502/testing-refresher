import { render, screen } from '@testing-library/react';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SearchBox', () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render an input field for searching', async () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });

  it('should not call onChange on enter if input field is empty', async () => {
    const { input, onChange, user } = renderSearchBox();

    // The {enter} simulates pressing the enter key after typing in the search term
    await user.type(input, '{enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should call the onChange when text is entered and Enter is pressed', async () => {
    const { input, onChange, user } = renderSearchBox();

    const searchTerm = 'Hello Search Term';
    await user.type(input, searchTerm + '{enter}');

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });
});
