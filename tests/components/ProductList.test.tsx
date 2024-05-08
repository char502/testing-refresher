import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { db } from '../mocks/db';
import AllProviders from '../AllProviders';

describe('ProductList', () => {
  // Should keep track of products created so know which ones to delete when finishing testing
  const productIds: number[] = [];

  // before running the tests in this suite, we create 3 x product objects
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
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
    render(<ProductList />, { wrapper: AllProviders });

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

    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/no products/i);

    // The names and number of items in the mock call might change
    // in the future so need to keep this more generic
    expect(message).toBeInTheDocument();
  });

  it('should render an error message when there is an error', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.error();
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched', async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.error();
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
