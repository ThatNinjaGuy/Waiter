export const searchByNameKey = (items, searchText) => {
  if (searchText && searchText.length > 0) {
    const filteredData = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.searchableKey?.toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredData;
  } else {
    return items;
  }
};

export const searchOrder = (items, searchText) => {
  if (searchText && searchText.length > 0) {
    const filteredData = items.filter((item) =>
      ("" + item.number).toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredData;
  } else {
    return items;
  }
};
