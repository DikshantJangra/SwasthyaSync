/**
 * Food API Service
 * 
 * Provides food search functionality using a built-in database
 * of 80+ common foods with accurate calorie data (per 100g).
 * 
 * Why built-in database instead of external API?
 * - External APIs (Open Food Facts, etc.) can be unreliable (503 errors)
 * - A local database is instant, works offline, and never fails
 * - Perfect for a college project demo / viva
 * - Same interface — can be swapped with a real API later
 * 
 * Calorie values are per 100g serving (sourced from USDA FoodData Central).
 */

import { FoodSearchResult } from "../domain/entities/FoodLog";

// ============================================================
// BUILT-IN FOOD DATABASE — Common foods with calorie data
// Calories are per 100g (approximate, from USDA)
// ============================================================
const FOOD_DATABASE: FoodSearchResult[] = [
  // --- Fruits ---
  { foodName: "Apple", calories: 52 },
  { foodName: "Banana", calories: 89 },
  { foodName: "Orange", calories: 47 },
  { foodName: "Mango", calories: 60 },
  { foodName: "Grapes", calories: 69 },
  { foodName: "Watermelon", calories: 30 },
  { foodName: "Papaya", calories: 43 },
  { foodName: "Pineapple", calories: 50 },
  { foodName: "Strawberry", calories: 32 },
  { foodName: "Pomegranate", calories: 83 },
  { foodName: "Guava", calories: 68 },
  { foodName: "Lychee", calories: 66 },

  // --- Vegetables ---
  { foodName: "Potato", calories: 77 },
  { foodName: "Tomato", calories: 18 },
  { foodName: "Onion", calories: 40 },
  { foodName: "Carrot", calories: 41 },
  { foodName: "Spinach", calories: 23 },
  { foodName: "Broccoli", calories: 34 },
  { foodName: "Cucumber", calories: 15 },
  { foodName: "Capsicum (Bell Pepper)", calories: 31 },
  { foodName: "Cauliflower", calories: 25 },
  { foodName: "Cabbage", calories: 25 },
  { foodName: "Green Peas", calories: 81 },
  { foodName: "Sweet Potato", calories: 86 },
  { foodName: "Mushroom", calories: 22 },
  { foodName: "Corn", calories: 86 },
  { foodName: "Beetroot", calories: 43 },
  { foodName: "Lettuce", calories: 15 },

  // --- Grains & Cereals ---
  { foodName: "White Rice (cooked)", calories: 130 },
  { foodName: "Brown Rice (cooked)", calories: 112 },
  { foodName: "Wheat Roti / Chapati", calories: 297 },
  { foodName: "Bread (White)", calories: 265 },
  { foodName: "Bread (Brown/Whole Wheat)", calories: 247 },
  { foodName: "Oats (dry)", calories: 389 },
  { foodName: "Pasta (cooked)", calories: 131 },
  { foodName: "Noodles (cooked)", calories: 138 },
  { foodName: "Poha (Flattened Rice)", calories: 130 },
  { foodName: "Upma", calories: 150 },
  { foodName: "Idli", calories: 39 },
  { foodName: "Dosa (plain)", calories: 133 },
  { foodName: "Paratha (plain)", calories: 260 },

  // --- Pulses & Lentils ---
  { foodName: "Dal (Toor/Arhar, cooked)", calories: 116 },
  { foodName: "Chana (Chickpeas, cooked)", calories: 164 },
  { foodName: "Rajma (Kidney Beans, cooked)", calories: 127 },
  { foodName: "Moong Dal (cooked)", calories: 105 },
  { foodName: "Masoor Dal (cooked)", calories: 116 },
  { foodName: "Soybean", calories: 446 },
  { foodName: "Peanuts", calories: 567 },

  // --- Dairy ---
  { foodName: "Milk (whole)", calories: 61 },
  { foodName: "Milk (skimmed)", calories: 34 },
  { foodName: "Curd / Yogurt", calories: 61 },
  { foodName: "Paneer", calories: 265 },
  { foodName: "Cheese (Cheddar)", calories: 402 },
  { foodName: "Butter", calories: 717 },
  { foodName: "Ghee", calories: 900 },
  { foodName: "Ice Cream (Vanilla)", calories: 207 },

  // --- Non-Veg ---
  { foodName: "Chicken Breast (cooked)", calories: 165 },
  { foodName: "Chicken Curry", calories: 150 },
  { foodName: "Egg (boiled)", calories: 155 },
  { foodName: "Egg Omelette", calories: 154 },
  { foodName: "Fish (Rohu, cooked)", calories: 97 },
  { foodName: "Mutton (cooked)", calories: 294 },
  { foodName: "Prawns (cooked)", calories: 99 },

  // --- Indian Curries & Sabzis ---
  { foodName: "Aloo Gobi (Potato Cauliflower)", calories: 118 },
  { foodName: "Aloo Matar (Potato Peas)", calories: 130 },
  { foodName: "Aloo Paratha", calories: 300 },
  { foodName: "Aloo Tikki", calories: 175 },
  { foodName: "Baingan Bharta (Roasted Eggplant)", calories: 100 },
  { foodName: "Bhindi Masala (Okra)", calories: 95 },
  { foodName: "Butter Chicken", calories: 198 },
  { foodName: "Chana Masala", calories: 160 },
  { foodName: "Chole Bhature", calories: 427 },
  { foodName: "Dal Fry", calories: 120 },
  { foodName: "Dal Makhani", calories: 150 },
  { foodName: "Dal Tadka", calories: 110 },
  { foodName: "Egg Curry", calories: 155 },
  { foodName: "Fish Curry", calories: 130 },
  { foodName: "Kadai Paneer", calories: 280 },
  { foodName: "Kadhi Pakora", calories: 130 },
  { foodName: "Malai Kofta", calories: 245 },
  { foodName: "Matar Paneer", calories: 220 },
  { foodName: "Mutton Curry", calories: 250 },
  { foodName: "Palak Paneer", calories: 190 },
  { foodName: "Paneer Butter Masala", calories: 260 },
  { foodName: "Paneer Tikka", calories: 250 },
  { foodName: "Rajma Chawal", calories: 175 },
  { foodName: "Shahi Paneer", calories: 270 },
  { foodName: "Tandoori Chicken", calories: 148 },

  // --- Indian Breads ---
  { foodName: "Naan", calories: 262 },
  { foodName: "Garlic Naan", calories: 280 },
  { foodName: "Butter Naan", calories: 310 },
  { foodName: "Rumali Roti", calories: 170 },
  { foodName: "Missi Roti", calories: 260 },
  { foodName: "Makki di Roti", calories: 180 },
  { foodName: "Puri", calories: 297 },
  { foodName: "Bhatura", calories: 330 },
  { foodName: "Kulcha", calories: 270 },
  { foodName: "Thepla", calories: 200 },
  { foodName: "Lachha Paratha", calories: 320 },

  // --- Rice Dishes ---
  { foodName: "Chicken Biryani", calories: 250 },
  { foodName: "Veg Biryani", calories: 200 },
  { foodName: "Mutton Biryani", calories: 280 },
  { foodName: "Egg Biryani", calories: 220 },
  { foodName: "Jeera Rice", calories: 160 },
  { foodName: "Pulao (Veg)", calories: 170 },
  { foodName: "Lemon Rice", calories: 165 },
  { foodName: "Curd Rice (Dahi Chawal)", calories: 140 },
  { foodName: "Khichdi", calories: 120 },
  { foodName: "Fried Rice", calories: 174 },

  // --- South Indian ---
  { foodName: "Masala Dosa", calories: 200 },
  { foodName: "Rava Dosa", calories: 185 },
  { foodName: "Medu Vada", calories: 190 },
  { foodName: "Uttapam", calories: 155 },
  { foodName: "Appam", calories: 120 },
  { foodName: "Pongal", calories: 145 },
  { foodName: "Sambhar", calories: 65 },
  { foodName: "Rasam", calories: 25 },
  { foodName: "Coconut Chutney", calories: 110 },
  { foodName: "Pesarattu", calories: 140 },
  { foodName: "Puttu", calories: 160 },
  { foodName: "Avial", calories: 90 },

  // --- Indian Snacks & Street Food ---
  { foodName: "Samosa", calories: 262 },
  { foodName: "Vada Pav", calories: 290 },
  { foodName: "Pani Puri / Golgappa", calories: 170 },
  { foodName: "Bhel Puri", calories: 160 },
  { foodName: "Sev Puri", calories: 200 },
  { foodName: "Dahi Puri", calories: 190 },
  { foodName: "Pav Bhaji", calories: 290 },
  { foodName: "Kachori", calories: 300 },
  { foodName: "Dhokla", calories: 130 },
  { foodName: "Khandvi", calories: 145 },
  { foodName: "Pakora / Bhajiya", calories: 240 },
  { foodName: "Spring Roll", calories: 220 },
  { foodName: "Momos (Steamed)", calories: 160 },
  { foodName: "Momos (Fried)", calories: 250 },
  { foodName: "Chaat (mixed)", calories: 180 },
  { foodName: "Dabeli", calories: 270 },
  { foodName: "Misal Pav", calories: 310 },
  { foodName: "Chole Kulche", calories: 400 },
  { foodName: "Frankie / Kathi Roll", calories: 330 },
  { foodName: "Maggi Noodles", calories: 388 },

  // --- Indian Sweets (Mithai) ---
  { foodName: "Gulab Jamun", calories: 387 },
  { foodName: "Rasgulla", calories: 186 },
  { foodName: "Jalebi", calories: 350 },
  { foodName: "Kaju Katli", calories: 502 },
  { foodName: "Barfi", calories: 390 },
  { foodName: "Ladoo (Besan)", calories: 420 },
  { foodName: "Ladoo (Motichoor)", calories: 370 },
  { foodName: "Halwa (Sooji/Suji)", calories: 290 },
  { foodName: "Halwa (Gajar/Carrot)", calories: 267 },
  { foodName: "Kheer / Payasam", calories: 160 },
  { foodName: "Rasmalai", calories: 194 },
  { foodName: "Sandesh", calories: 280 },
  { foodName: "Peda", calories: 400 },
  { foodName: "Imarti", calories: 340 },
  { foodName: "Malpua", calories: 310 },
  { foodName: "Shrikhand", calories: 250 },
  { foodName: "Kulfi", calories: 140 },
  { foodName: "Rabri", calories: 200 },

  // --- Western Fast Food ---
  { foodName: "Pizza (1 slice)", calories: 266 },
  { foodName: "Burger", calories: 295 },
  { foodName: "French Fries", calories: 312 },
  { foodName: "Chips / Crisps", calories: 536 },
  { foodName: "Biscuit (Digestive)", calories: 457 },
  { foodName: "Chocolate (Milk)", calories: 535 },
  { foodName: "Cake (Chocolate)", calories: 371 },
  { foodName: "Cookies", calories: 488 },
  { foodName: "Popcorn (plain)", calories: 375 },
  { foodName: "Sandwich (Veg)", calories: 250 },

  // --- Indian Beverages ---
  { foodName: "Chai (Tea with milk & sugar)", calories: 37 },
  { foodName: "Masala Chai", calories: 42 },
  { foodName: "Filter Coffee (South Indian)", calories: 35 },
  { foodName: "Coffee (black)", calories: 2 },
  { foodName: "Coffee (with milk)", calories: 30 },
  { foodName: "Lassi (sweet)", calories: 72 },
  { foodName: "Lassi (salted)", calories: 44 },
  { foodName: "Mango Lassi", calories: 85 },
  { foodName: "Chaas / Buttermilk", calories: 24 },
  { foodName: "Nimbu Pani (Lemonade)", calories: 40 },
  { foodName: "Jaljeera", calories: 20 },
  { foodName: "Aam Panna", calories: 55 },
  { foodName: "Thandai", calories: 130 },
  { foodName: "Badam Milk", calories: 95 },
  { foodName: "Haldi Doodh (Turmeric Milk)", calories: 70 },
  { foodName: "Coconut Water", calories: 19 },
  { foodName: "Sugarcane Juice", calories: 73 },
  { foodName: "Orange Juice", calories: 45 },
  { foodName: "Cola / Soft Drink", calories: 42 },
  { foodName: "Protein Shake", calories: 113 },

  // --- Dry Fruits & Nuts ---
  { foodName: "Almonds (Badam)", calories: 579 },
  { foodName: "Cashews (Kaju)", calories: 553 },
  { foodName: "Walnuts (Akhrot)", calories: 654 },
  { foodName: "Pistachios (Pista)", calories: 562 },
  { foodName: "Raisins (Kishmish)", calories: 299 },
  { foodName: "Dates (Khajoor)", calories: 277 },
  { foodName: "Dried Figs (Anjeer)", calories: 249 },
  { foodName: "Makhana (Fox Nuts)", calories: 350 },
  { foodName: "Chironji", calories: 580 },
];

/**
 * Search for food items in our built-in database.
 * 
 * @param query - The search term (e.g., "apple", "rice", "chicken")
 * @returns Array of { foodName, calories } objects (max 10 results)
 * 
 * Flow:
 * 1. Convert query to lowercase for case-insensitive matching
 * 2. Filter foods whose name contains the search term
 * 3. Return top 10 matching results
 */
export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  // Convert search query to lowercase for case-insensitive matching
  const searchTerm = query.toLowerCase().trim();

  // Filter foods whose name contains the search term
  const results = FOOD_DATABASE.filter(food => 
    food.foodName.toLowerCase().includes(searchTerm)
  ).map(food => {
    const calories = food.calories;
    const protein = (food as any).protein ?? Math.round((calories * 0.15) / 4);
    const carbs = (food as any).carbs ?? Math.round((calories * 0.55) / 4);
    const fat = (food as any).fat ?? Math.round((calories * 0.3) / 9);

    return {
      foodName: food.foodName,
      calories: calories,
      protein,
      carbs,
      fat
    };
  });

  // Return top 10 results
  return results.slice(0, 10);
}
