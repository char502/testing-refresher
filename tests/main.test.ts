import { it, expect } from 'vitest';
// import { faker } from '@faker-js/faker';
import { db } from './mocks/db';

// describe('group', () => {
//   it('should', async () => {
//     const response = await fetch('/categories');
//     const data = await response.json();
//     console.log(data);
//     expect(data).toHaveLength(3);
//   });
// });

describe('group', () => {
  it('should', () => {
    const product = db.product.create({ name: 'Apple' });
    // ====================================================
    console.log(product);
    // console.log(db.product.getAll());
    // console.log(db.product.count());
    // console.log(db.product.delete({ where: { id: { equals: product.id} } }));
    // ====================================================
    // console.log({
    //   name: faker.commerce.productName(),
    //   price: faker.commerce.price({ min: 1, max: 100 }),
    // });
  });
});
