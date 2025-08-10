import { ReactNode } from 'react';

interface __NAME__Props {
  children: ReactNode;
}

export default function __NAME__({ children }: __NAME__Props): JSX.Element {
  return (
    <div className="__NAME_LOWER__-layout">
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
