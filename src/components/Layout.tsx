import type { ReactNode } from 'react';
import TopNav from './TopNav';
import CartDrawer from './CartDrawer';
import ToastContainer from './ToastContainer';
import AuthSimulation from './AuthSimulation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <TopNav />
      <AuthSimulation />
      {children}
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
