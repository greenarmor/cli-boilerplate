import { createContext, useContext, useState } from 'react';

const __NAME__Context = createContext(null);

export function __NAME__Provider({ children }) {
  const [state, setState] = useState(null);

  return (
    <__NAME__Context.Provider value={{ state, setState }}>
      {children}
    </__NAME__Context.Provider>
  );
}

export function use__NAME__() {
  return useContext(__NAME__Context);
}
