import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import ProductList from '../../src/components/ProductList';

describe('ProductList', () => {
  it('should render the list of products', async () => {
    render(<ProductList />);

    const products = await screen.findAllByRole('listitem');

    // The names and number of items in the mock call might change
    // in the future so need to keep this more generic
    expect(products.length).toBeGreaterThan(0);

    screen.debug();
  });
});
