import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductList', () => {
  // Should keep track of products created so know which ones to delete when finishing testing
  const productIds: number[] = [];

  // before running the tests in this suite, we create 3 x product objects
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);

      console.log(product);
    });
  });

  // to make sure our tests run in a clean state and don't mess with our global db object
  // should always do cleanup in the after all hook

  afterAll(() => {
    // only want to delete the products we have created for this test
    // not all the products in the db
    // Here only want to delete the products who's id's are in this array
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
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
