import { createContext, useContext, useState, type ReactNode } from "react";
import { childrenOf } from "../services/academics";
import type { User } from "../types";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

interface ActiveStudentValue {
  /** The student whose learning is shown: the student themself, or the parent's selected child. */
  student: User | null;
  /** Parent accounts only: every linked child. */
  children: User[];
  selectStudent: (studentId: string) => void;
}

const ActiveStudentContext = createContext<ActiveStudentValue | null>(null);

export function ActiveStudentProvider({ children: content }: { children: ReactNode }) {
  const { data } = useData();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const children = user?.role === "parent" ? childrenOf(data, user) : [];
  const student =
    user?.role === "student" ? user : (children.find((child) => child.id === selectedId) ?? children[0] ?? null);

  return (
    <ActiveStudentContext.Provider value={{ student, children, selectStudent: setSelectedId }}>
      {content}
    </ActiveStudentContext.Provider>
  );
}

export function useActiveStudent() {
  const context = useContext(ActiveStudentContext);
  if (!context) throw new Error("useActiveStudent must be used inside ActiveStudentProvider");
  return context;
}
