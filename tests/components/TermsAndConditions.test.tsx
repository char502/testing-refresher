import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  // helper function  for rendering our component and
  // returning the common elements want to query
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    };
  };

  it('should render with correct text and initial state', () => {
    const { heading, checkbox, button } = renderComponent();

    // can remove 'to be in the document' assertions as the
    // 'renderComponent' call would result in an error already
    // if they weren't in the document

    expect(heading).toHaveTextContent(/terms & conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it('should enable submit button when checkbox is checked', async () => {
    // Arrange
    const { checkbox, button } = renderComponent();

    // Act
    const user = userEvent.setup();
    await user.click(checkbox);

    // Assert
    expect(button).toBeEnabled();
  });
});
