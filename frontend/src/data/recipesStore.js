// Shared recipes store using localStorage
// This allows admin and public recipes pages to share data

const STORAGE_KEY = 'alriwaj_recipes'

export const defaultRecipes = [
  {
    id: 1,
    title: 'Chicken Biryani',
    category: 'Rice Dishes',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    time: '2 hours',
    servings: '6-8',
    difficulty: 'Medium',
    description: 'Aromatic basmati rice cooked with tender chicken and traditional spices.',
    ingredients: [
      '500g Chicken',
      '3 cups Basmati rice',
      '2 onions (sliced)',
      '1 cup yogurt',
      '2 tbsp ginger-garlic paste',
      'Biryani masala',
      'Saffron strands',
      'Fresh mint and coriander'
    ],
    steps: [
      'Marinate chicken in yogurt and spices for 2 hours.',
      'Fry onions until golden brown.',
      'Soak rice for 30 minutes.',
      'Layer rice and chicken in a pot.',
      'Cook on low heat for 45 minutes.'
    ]
  },
  {
    id: 2,
    title: 'Seekh Kabab',
    category: 'BBQ',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
    time: '45 mins',
    servings: '4-6',
    difficulty: 'Easy',
    description: 'Minced meat grilled on skewers with aromatic spices.',
    ingredients: [
      '500g Minced Meat',
      '2 onions (grated)',
      'Fresh coriander',
      'Green chilies',
      'Ginger-garlic paste',
      'Cumin powder',
      'Salt to taste',
      'Skewers'
    ],
    steps: [
      'Mix all ingredients thoroughly.',
      'Refrigerate for 1 hour.',
      'Shape onto skewers.',
      'Grill on medium heat.',
      'Serve with mint chutney.'
    ]
  },
  {
    id: 3,
    title: 'Butter Chicken',
    category: 'Curry',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    time: '1 hour',
    servings: '4-5',
    difficulty: 'Medium',
    description: 'Creamy tomato-based curry with tender chicken pieces.',
    ingredients: [
      '750g Chicken pieces',
      '1 cup tomato puree',
      '1 cup cream',
      '100g butter',
      'Ginger-garlic paste',
      'Garam masala',
      'Kashmiri red chili',
      'Fenugreek leaves'
    ],
    steps: [
      'Marinate and grill chicken.',
      'Prepare tomato gravy.',
      'Add spices and butter.',
      'Simmer chicken in gravy.',
      'Finish with cream.'
    ]
  },
  {
    id: 4,
    title: 'Chicken Tikka',
    category: 'BBQ',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    time: '1 hour',
    servings: '4-6',
    difficulty: 'Easy',
    description: 'Tender chicken chunks marinated in yogurt and spices.',
    ingredients: [
      '500g Chicken breast (cubed)',
      '1 cup yogurt',
      'Tikka masala',
      'Lemon juice',
      'Garlic paste',
      'Green chilies',
      'Fresh mint',
      'Salt to taste'
    ],
    steps: [
      'Marinate chicken in yogurt mixture.',
      'Let it rest for 4 hours.',
      'Thread onto skewers.',
      'Grill until charred.',
      'Serve with naan.'
    ]
  },
  {
    id: 5,
    title: 'Chicken Korma',
    category: 'Curry',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    time: '1.5 hours',
    servings: '5-6',
    difficulty: 'Medium',
    description: 'Rich and creamy curry with nuts and aromatic spices.',
    ingredients: [
      '1 whole Chicken',
      '1 cup yogurt',
      'Onions (paste)',
      'Almonds & cashews',
      'Korma masala',
      'Fresh cream',
      'Ghee',
      'Rose water'
    ],
    steps: [
      'Brown onions and make paste.',
      'Cook spices in ghee.',
      'Add chicken and yogurt.',
      'Add nut paste.',
      'Simmer until tender.'
    ]
  },
  {
    id: 6,
    title: 'Pulao',
    category: 'Rice Dishes',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    time: '1 hour',
    servings: '4-5',
    difficulty: 'Easy',
    description: 'Aromatic rice dish with meat and mild spices.',
    ingredients: [
      '500g Mixed meat or vegetables',
      '2 cups basmati rice',
      'Onions (fried)',
      'Whole spices',
      'Stock',
      'Ghee',
      'Fried onions for topping',
      'Fresh herbs'
    ],
    steps: [
      'Prepare meat with spices.',
      'Soak rice.',
      'Cook meat until half done.',
      'Add rice and stock.',
      'Dum cook on low heat.'
    ]
  }
]

// Get recipes from localStorage or use default
export function getRecipes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading recipes from localStorage:', e)
  }
  // Initialize with default recipes if nothing stored
  saveRecipes(defaultRecipes)
  return defaultRecipes
}

// Save recipes to localStorage
export function saveRecipes(recipes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  } catch (e) {
    console.error('Error saving recipes to localStorage:', e)
  }
}

// Add a new recipe
export function addRecipe(recipe) {
  const recipes = getRecipes()
  const newRecipe = { ...recipe, id: Date.now() }
  recipes.push(newRecipe)
  saveRecipes(recipes)
  return newRecipe
}

// Update an existing recipe
export function updateRecipe(id, updatedRecipe) {
  const recipes = getRecipes()
  const index = recipes.findIndex(r => r.id === id)
  if (index !== -1) {
    recipes[index] = { ...updatedRecipe, id }
    saveRecipes(recipes)
    return recipes[index]
  }
  return null
}

// Delete a recipe
export function deleteRecipe(id) {
  const recipes = getRecipes()
  const filtered = recipes.filter(r => r.id !== id)
  saveRecipes(filtered)
  return filtered
}
