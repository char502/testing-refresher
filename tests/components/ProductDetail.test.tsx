import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
// import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import { db } from '../mocks/db';
import AllProviders from '../AllProviders';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    // only want to delete the products we have created for this test
    // not all the products in the db
    // Here only want to delete the products who's id's are in this array
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it('should render product details', async () => {
    // getting the product from the database
    // using findFirst() can apply a filter to the items in the db
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    // Use regular expression rather than exact string because
    // findByText will look for (name: 'Licensed Cotton Car')
    // not just 'Licensed Cotton Car'
    // so using new RegExp will prevent the error as it will only find the bit of the string you want
    // Using a ! as always expecting the product to be there (it won't ever be null)
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    // price is a number so cannot pass it as an argument to regex
    // so here have to use toString() on the price to convert it to a string
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it('should render message if product not found', async () => {
    // Need to overwrite the request created in the handlers file
    // If a request is sent to this mock endpoint, will get null
    server.use(
      http.get('/products/1', () => {
        return HttpResponse.json(null);
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    // render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    // render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);

    // console.log(message);

    expect(message).toBeInTheDocument();
  });

  it('should render an error if data fetching fails', async () => {
    server.use(
      http.get('/products/1', () => {
        return HttpResponse.error();
      })
    );

    // render(<ProductDetail productId={1} />);
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', () => {
    server.use(
      http.get('/products/1', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    // render(<ProductDetail productId={1} />);
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
  });

  it('should remove the loading indicator after data is fetched', async () => {
    // render(<ProductDetail productId={1} />);
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(
      http.get('/products/1', () => {
        return HttpResponse.error();
      })
    );

    // render(<ProductDetail productId={1} />);
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
