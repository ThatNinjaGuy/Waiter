export const getAdminGroups = (role) => {
  if (!role || role === "Admin" || role === "Owner" || role === "Manager")
    return true;
};

export const getKitchenGroups = (role) => {
  if (role === "Cook" || role === "Manager") return true;
};

export const getServerGroups = (role) => {
  if (role === "Waiter" || role === "Manager") return true;
};
