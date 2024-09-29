export const isAdminEmployee = (role) => {
  /**
   * Users with no profiles can be app owners, so role can be null.
   * Admin/ Owner/ Manager are considered as admin users
   **/
  if (!role || role === "Admin" || role === "Owner" || role === "Manager")
    return true;
  return false;
};

export const isKitchenEmployee = (role) => {
  if (getAdminGroups(role) || role === "Cook") return true;
  return false;
};

export const isServerEmployee = (role) => {
  if (getAdminGroups(role) || role === "Waiter") return true;
  return false;
};

export const handleUnauthorizedError = () => {
  // console.log("Unauthorized");
};
