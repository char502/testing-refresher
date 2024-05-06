import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProductsPage from '../../src/pages/BrowseProductsPage';
// import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { http, delay, HttpResponse } from 'msw';
//   import { db } from '../mocks/db';
//   import AllProviders from '../AllProviders';
import { Theme } from '@radix-ui/themes';

describe('BrowseProductsPage', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProductsPage />
      </Theme>
    );

    // return {
    //   skeletonCategories:
    // }
  };

  it('should show a loading skeleton when fetching categories', () => {
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();

    expect(
      screen.getByRole('progressbar', { name: /categories/i })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    server.use(
      http.get('/categories', () => {
        return HttpResponse.json([]);
      })
    );
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i })
    );
  });

  it('should show a loading skeleton when fetching products', () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();

    screen.debug();

    expect(
      screen.getByRole('progressbar', { name: /products/i })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.json([]);
      })
    );
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );
  });
});
