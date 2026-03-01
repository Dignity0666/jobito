import { createContext, useState, useContext, type ReactNode } from "react";

export interface ShowCTAContextType {
  showCTA: boolean;
  setShowCTA: (value: boolean) => void;
}

const ShowCTAContext = createContext<ShowCTAContextType | undefined>(undefined);

export const ShowCTAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showCTA, setShowCTA] = useState(false);

  return (
    <ShowCTAContext.Provider value={{ showCTA, setShowCTA }}>
      {children}
    </ShowCTAContext.Provider>
  );
};

export const useShowCTA = (): ShowCTAContextType => {
  const context = useContext(ShowCTAContext);
  if (!context) {
    throw new Error("useShowCTA must be used within ShowCTAProvider");
  }
  return context;
};
