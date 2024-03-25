import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductList', () => {
  it('should render the list of products', async () => {
    render(<ProductList />);

    const items = await screen.findAllByRole('listitem');

    // The names and number of items in the mock call might change
    // in the future so need to keep this more generic
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render no products available if no product is found', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />);

    const message = await screen.findByText(/no products/i);

    // The names and number of items in the mock call might change
    // in the future so need to keep this more generic
    expect(message).toBeInTheDocument();
  });
});
