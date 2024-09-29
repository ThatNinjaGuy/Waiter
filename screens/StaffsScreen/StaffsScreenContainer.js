import React, { useState, useEffect, useContext } from "react";
import StaffScreenView from "./StaffScreenView";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import UnauthorizedScreen from "@/components/Authentication/UnauthorizedScreen";
import { updateStaff, deleteStaff } from "@/firebase/queries/staffs";
import { isAdminEmployee } from "@/utils/entitlementManagement";
const StaffsScreenContainer = () => {
  const { user, staffs } = useContext(AuthContext);
  const [staffsState, setStaffsState] = useState([]);
  const isStaffEditable = isAdminEmployee(user?.staffDetails?.role);

  useEffect(() => {
    setStaffsState(staffs);
  }, [staffs]);

  if (!user) return <AuthScreen />;

  return (
    <StaffScreenView
      staffs={staffsState}
      deleteStaff={deleteStaff}
      updateStaff={(id, updatedItem) => updateStaff(id, updatedItem, staffs)}
      isStaffEditable={isStaffEditable}
    />
  );
};

export default StaffsScreenContainer;
