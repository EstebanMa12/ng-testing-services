import { faker } from '@faker-js/faker'

import { Product } from './product.model'

export const generateOneProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(), 10),
    description: faker.commerce.productDescription(),
    category : {
      id: faker.number.int(),
      name: faker.commerce.department()
      },
    images: [faker.image.url(), faker.image.url()]
  }
}

export const generateManyProducts = (quantity: number = 10): Product[] => {
  const products: Product[] = []
  for (let i = 0; i < quantity; i++) {
    products.push(generateOneProduct())
  }
  return [...products]
}

