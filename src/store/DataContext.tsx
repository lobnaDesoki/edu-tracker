import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { seedData } from "../data/seed";
import type { AppData } from "../types";
import { dataReducer, type DataAction } from "./dataReducer";

interface DataContextValue {
  data: AppData;
  dispatch: Dispatch<DataAction>;
}

const DataContext = createContext<DataContextValue | null>(null);

/** Holds the demo data in memory. A page refresh restores the seed. */
export function DataProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(dataReducer, seedData);
  return <DataContext.Provider value={{ data, dispatch }}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
}
