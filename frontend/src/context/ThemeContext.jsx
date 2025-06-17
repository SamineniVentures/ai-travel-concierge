import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div className={dark ? 'dark min-h-full' : 'min-h-full'}>{children}</div>
    </ThemeContext.Provider>
  );
};
