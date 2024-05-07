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
import { tabsListPropDefs, TabsTrigger, Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { Category } from '../../src/entities';
import { db } from '../mocks/db';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });
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

  it('should not render an error if categories cannot be fetched', async () => {
    server.use(
      http.get('/categories', () => {
        return HttpResponse.error();
      })
    );

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    expect(
      screen.queryByRole('combobox', { name: /category/ })
    ).not.toBeInTheDocument();
  });

  it('should render an error if products cannot be fetched', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.error();
      })
    );

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render categories', async () => {
    renderComponent();

    const combobox = await screen.findByRole('combobox');

    // expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category.name })
      ).toBeInTheDocument();
    });
  });
});
