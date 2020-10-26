import React, { createContext } from "react";

const UserContext = createContext();

// just used to initialize, real context is grabbed from App's return after snagging from database.

export default UserContext;
