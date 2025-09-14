import React, { createContext, useState, useContext } from 'react';

const ZoneContext = createContext();

export const ZoneProvider = ({ children }) => {
  const [points, setPoints] = useState([]);

  return (
    <ZoneContext.Provider value={{ points, setPoints }}>
      {children}
    </ZoneContext.Provider>
  );
};

export const useZone = () => useContext(ZoneContext);