export function generateUniqueKey(existingItems, newItem) {
  // Helper function to create initial key from item name
  const createInitialKey = (name) => {
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  // Helper function to check if a key exists in the list of items
  const keyExists = (key) => {
    return existingItems.some((item) => item.searchableKey === key);
  };

  if (!newItem.name) return null;
  if (newItem.searchableKey && !keyExists) return newItem.searchableKey;

  let key = createInitialKey(newItem.name);
  let counter = 1;

  // If the key already exists, modify it until it's unique
  while (keyExists(key)) {
    if (counter === 1) {
      // First try: add more letters from each word
      key = newItem.name
        .split(" ")
        .map((word) =>
          word.substring(0, Math.min(word.length, counter + 1)).toUpperCase()
        )
        .join("");
    } else {
      // Subsequent tries: append a number
      key = createInitialKey(newItem.name) + counter;
    }
    counter++;
  }

  return key;
}
