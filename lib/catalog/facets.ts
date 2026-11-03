export const CATALOG_FACETS = {
  categories: ['Womens', 'Mens', 'Children', 'Unisex', 'Accessories', 'Footwear'],
  types: ['Jeans', 'Shirts', 'Hoodie', 'Polo Shirts', 'Jackets', 'Sneakers', 'Caps', 'Bags'],
  styles: ['Casual', 'Formal', 'Party', 'Gym'],
  colors: ['Black', 'Gray', 'White', 'Navy', 'Burgundy', 'Orange', 'Tan', 'Red', 'Pastel'],
  sizes: ['S', 'M', 'L', 'XL', 'One Size', '7', '8', '9', '10', '11'],
}

export const CATEGORY_LABELS: Record<string, string> = {
  Womens: 'Women',
  Mens: 'Men',
  Children: 'Kids',
  Unisex: 'Unisex',
  Accessories: 'Accessories',
  Footwear: 'Footwear',
}

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category
}
