import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProductsPage from '../../src/pages/BrowseProductsPage';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: 'Category ' + item });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProductsPage />
        </Theme>
      </CartProvider>
    );

    return {
      getProductsSkeleton: () =>
        screen.queryByRole('progressbar', { name: /products/i }),

      getCategoriesSkeleton: () =>
        screen.queryByRole('progressbar', { name: /categories/i }),

      // Have to use a function here because the categories combobox
      // is not rendered at the time the component is rendered
      getCategoriesComboBox: () => screen.queryByRole('combobox'),
    };
  };

  it('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories');
    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    server.use(
      http.get('/categories', () => {
        return HttpResponse.json([]);
      })
    );
    const { getCategoriesSkeleton } = renderComponent();

    // Here we don't call the function, only pass the function reference
    // because 'waitForElementToBeRemoved', requires a function, not an element
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it('should show a loading skeleton when fetching products', () => {
    simulateDelay('/products');
    const { getProductsSkeleton } = renderComponent();

    // In this sitation need to call the 'getProductsSkeleton' function because
    // we have to pass an element to the expect function
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.json([]);
      })
    );

    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories');

    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it('should render an error if products cannot be fetched', async () => {
    simulateError('/products');

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render categories', async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it('should render products', async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
