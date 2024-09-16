export const menuItemFormSchema = (categories) => [
  {
    name: "searchableKey",
    placeholder: "Key",
    inputMode: "default",
    type: "text",
  },
  {
    name: "name",
    placeholder: "Item Name",
    inputMode: "default",
    type: "text",
  },
  {
    name: "type",
    placeholder: "Type",
    inputMode: "default",
    type: "dropdown",
    options: ["Veg", "Non-Veg", "Egg", "Vegan"],
  },
  {
    name: "isAvailable",
    placeholder: "Is Available?",
    inputMode: "default",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    name: "category",
    placeholder: "Category",
    inputMode: "default",
    type: "dropdown",
    options: categories,
  },
  {
    name: "price",
    placeholder: "Price",
    inputMode: "numeric",
    type: "text",
    dataType: "numeric",
  },
  {
    name: "cuisine",
    placeholder: "Cuisine",
    inputMode: "default",
    type: "dropdown",
    options: ["Indian", "Chinese", "Italian"],
  },
  {
    name: "image",
    placeholder: "Image URL",
    inputMode: "default",
    type: "text",
  },
];