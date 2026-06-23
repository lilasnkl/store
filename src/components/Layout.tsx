import type { ReactNode } from 'react';
import CartDrawer from './CartDrawer';
import ToastContainer from './ToastContainer';
import AuthSimulation from './AuthSimulation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <AuthSimulation />
      {children}
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
