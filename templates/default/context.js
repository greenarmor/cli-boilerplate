import { createContext, useContext } from 'react';

const __NAME__Context = createContext(null);

export function use__NAME__() {
  return useContext(__NAME__Context);
}

export default __NAME__Context;
