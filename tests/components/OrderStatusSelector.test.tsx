import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import userEvent from '@testing-library/user-event';
import { Theme } from '@radix-ui/themes';

describe('OrderStatusSelector', () => {
  const renderOrderStatusSelector = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole('combobox'),
      getOptions: () => screen.findAllByRole('option'),
      getOption: (label: RegExp) =>
        screen.findByRole('option', {
          name: label,
        }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render a select dropdown with New selected by default', () => {
    const { trigger } = renderOrderStatusSelector();

    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render the correct statuses', async () => {
    const { trigger, user, getOptions } = renderOrderStatusSelector();

    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'should call onChange with $value when the $label option is selected',
    async ({ label, value }) => {
      const { trigger, user, onChange, getOption } =
        renderOrderStatusSelector();

      await user.click(trigger);

      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' when the New option is selected", async () => {
    const { trigger, user, onChange, getOption } = renderOrderStatusSelector();

    await user.click(trigger);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger);

    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith('new');
  });
});
