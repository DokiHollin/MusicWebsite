import React, { ReactNode, createContext, useContext, useState } from 'react';

const BGContext = createContext<BgContextType | null>(null);


interface BGProviderProps {
    children: ReactNode;
  }
interface BgContextType {
bgPath: string;
setBgPath: React.Dispatch<React.SetStateAction<string>>;
}
  
  export const BGProvider: React.FC<BGProviderProps> = ({ children }) => {
    const [bgPath, setBgPath] = useState('');
  
    return (
      <BGContext.Provider value={{ bgPath, setBgPath }}>
        {children}
      </BGContext.Provider>
    );
  };
  

  export const useBG = () => {
    const context = useContext(BGContext);
    if (!context) {
      throw new Error('useBG must be used within a BGProvider');
    }
    return context;
  };
  