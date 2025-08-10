import { createContext, useContext } from 'react';

const __NAME__Context = createContext<unknown>(null);

export function use__NAME__(): unknown {
  return useContext(__NAME__Context);
}

export default __NAME__Context;
