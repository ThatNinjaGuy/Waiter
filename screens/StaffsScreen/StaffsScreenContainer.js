import React, { useState, useEffect, useContext } from "react";
import StaffScreenView from "./StaffScreenView";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import UnauthorizedScreen from "@/components/Authentication/UnauthorizedScreen";
import { updateStaff, deleteStaff } from "@/firebase/queries/staffs";
const StaffsScreenContainer = () => {
  const { user, staffs } = useContext(AuthContext);
  const [staffsState, setStaffsState] = useState([]);

  useEffect(() => {
    setStaffsState(staffs);
  }, [staffs]);

  if (!user) return <AuthScreen />;

  if (
    user.staffDetails &&
    !(
      user.staffDetails.role === "Manager" ||
      user.staffDetails.role === "Owner" ||
      !user.staffDetails.role ||
      user.staffDetails.role === ""
    )
  ) {
    return <UnauthorizedScreen />;
  }

  return (
    <StaffScreenView
      staffs={staffsState}
      deleteStaff={deleteStaff}
      updateStaff={(id, updatedItem) => updateStaff(id, updatedItem, staffs)}
    />
  );
};

export default StaffsScreenContainer;
