/* eslint-disable @typescript-eslint/unbound-method */
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

// this creates an in-memory database that is shared between our tests
// this is a single global instance that is shared between our tests
// so to make sure our tests are robust and trustworthy
// we should make sure that they are not dependant on any kind of global state
export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf('product'),
  },
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf('category'),
  },
});

export const getProductsByCategory = (categoryId: number) =>
  db.product.findMany({
    where: {
      categoryId: { equals: categoryId },
    },
  });
