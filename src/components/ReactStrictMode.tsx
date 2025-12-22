import { StrictMode, type ReactNode } from 'react';

type ReactStrictModeProps = {
  children: ReactNode;
};

export default function ReactStrictMode({ children }: ReactStrictModeProps) {
  return <StrictMode>{children}</StrictMode>;
}
