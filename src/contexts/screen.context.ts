import { createContext, useContext } from "react";

const initialState = { scroll: 0 };

export const ScreenContext = createContext(initialState);

export const useScreen = () => useContext(ScreenContext);
