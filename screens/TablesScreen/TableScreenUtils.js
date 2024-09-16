const cleanupTable = (table) => {
  table = {
    ...table,
    bookingTime: null,
    guestMobile: null,
    guestName: null,
    guests: null,
    notes: null,
    occasion: null,
    orderValue: 0,
    totalOrders: 0,
    waiter: null,
    orders: [],
  };
  return table;
};

const archiveOrders = (table, addCompletedOrder) => {
  let orderValue = 0;
  table.orders = table.orders.map((o) => {
    orderValue += o.price;
    return { ...o, status: "COMPLETE" };
  });
  console.log(table);
  table.totalOrders = table.orders.length;
  table.orderValue = orderValue;
  addCompletedOrder(table);
};

export const markOrderAsCompleted = (
  updatedTable,
  selectedTable,
  addCompletedOrder
) => {
  if (
    selectedTable.status === "Occupied" &&
    updatedTable.status === "Available"
  ) {
    archiveOrders(updatedTable, addCompletedOrder);
    updatedTable = cleanupTable(updatedTable);
  }
  return updatedTable;
};

export const getUniqueFilters = (tables) => {
  const roles = tables?.map((item) => item.status);
  return ["All", ...new Set(roles)];
};

export const filterBySelectedFilter = (
  status,
  setSelectedFilter,
  setFilteredItems,
  tables
) => {
  setSelectedFilter(status);
  if (status === "All") {
    setFilteredItems(tables);
  } else {
    setFilteredItems(tables.filter((item) => item.status === status));
  }
};

export const handleTableOrderUpdate = (
  orders,
  tables,
  selectedTable,
  setTables,
  updateTableDetails
) => {
  const tableIndex = tables.findIndex((t) => t.id === selectedTable.id);
  if (tableIndex !== -1) {
    const updatedTable = {
      ...tables[tableIndex],
      orders,
      status: "Occupied",
    };
    const newTables = [...tables];
    newTables[tableIndex] = updatedTable;
    setTables(newTables);
    updateTableDetails(selectedTable.id, updatedTable, tables, setTables);
  } else console.error("Couldn't find table");
};
