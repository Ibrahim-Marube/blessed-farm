import Header from '@/components/customer/header';
import CartSidebar from '@/components/customer/cart-sidebar';
import { Toaster } from 'sonner';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <CartSidebar />
      <Toaster position="top-center" richColors />
    </>
  );
}
