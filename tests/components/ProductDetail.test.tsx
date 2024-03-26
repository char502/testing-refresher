import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
// import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

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

    // console.log(productId);
    // console.log(product);

    render(<ProductDetail productId={productId} />);

    // Use regular expression rather than exact string because
    // findByText will look for (name: 'Licensed Cotton Car')
    // not just 'Licensed Cotton Car'
    // so using new RegExp will prevent the error as it will only find the bit of the string you want
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

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/Invalid ProductId/i);

    expect(message).toBeInTheDocument();
  });
});
