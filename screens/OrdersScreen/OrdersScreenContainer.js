import React, { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const MenuScreenContainer = () => {
  const [orders, setOrders] = useState([]);

  return <></>;
};

export default MenuScreenContainer;
