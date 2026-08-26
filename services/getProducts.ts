import { products } from '../app/lib/data/products'
export const getProducts = async () => {
  // const res = await fetch('https://your-api-url.com/products')

  // if (!res.ok) {
  //   throw new Error('Failed to fetch products')
  // }

  // return res.json()
  return products
}
