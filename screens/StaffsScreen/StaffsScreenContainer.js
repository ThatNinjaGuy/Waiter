import React, { useState, useEffect, useContext } from "react";
import StaffScreenView from "./StaffScreenView";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { updateStaff, deleteStaff } from "@/firebase/queries/staffs";
import { isAdminEmployee } from "@/utils/entitlementManagement";
const StaffsScreenContainer = () => {
  const { user, staffs, restaurantPath } = useContext(AuthContext);
  const [staffsState, setStaffsState] = useState([]);
  const isStaffEditable = isAdminEmployee(user?.staffDetails?.role);

  useEffect(() => {
    setStaffsState(staffs);
  }, [staffs]);

  if (!user) return <AuthScreen />;

  return (
    <StaffScreenView
      staffs={staffsState}
      deleteStaff={(id) => deleteStaff(restaurantPath, id)}
      updateStaff={(id, updatedItem) =>
        updateStaff(restaurantPath, id, updatedItem, staffs)
      }
      isStaffEditable={isStaffEditable}
    />
  );
};

export default StaffsScreenContainer;
