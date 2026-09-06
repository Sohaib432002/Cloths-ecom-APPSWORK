const TYPE_IMAGES: Record<string, string[]> = {
  Jeans: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80',
  ],
  Shirts: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a7ce3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=900&q=80',
  ],
  Hoodie: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578768079052-c78764a44f80?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1614975059251-ebd235b079a0?auto=format&fit=crop&w=900&q=80',
  ],
  'Polo Shirts': [
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  ],
  Jackets: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
  ],
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  Mens: [
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80',
  ],
  Womens: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515e0c78f?auto=format&fit=crop&w=900&q=80',
  ],
  Children: [
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=900&q=80',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  ],
}

export const MARKETING_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
  casual: 'https://images.unsplash.com/photo-1515886657613-9f3515e0c78f?auto=format&fit=crop&w=1200&q=80',
  formal: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  party: 'https://images.unsplash.com/photo-1519671482677-9573589d76ce?auto=format&fit=crop&w=1200&q=80',
  gym: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  about: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80',
}

function pick(pool: string[], seed: number) {
  return pool[Math.abs(seed) % pool.length]
}

export function resolveProductImage(input: {
  id: number
  type: string
  category: string
  index?: number
}) {
  const pool = TYPE_IMAGES[input.type] || CATEGORY_IMAGES[input.category] || TYPE_IMAGES.Shirts
  return pick(pool, input.id + (input.index ?? 0) * 7)
}

export function resolveProductGallery(input: { id: number; type: string; category: string }) {
  const pool = [
    ...(TYPE_IMAGES[input.type] || []),
    ...(CATEGORY_IMAGES[input.category] || []),
  ]
  const unique = [...new Set(pool)]
  return [0, 1, 2].map((index) => pick(unique, input.id + index * 11))
}
