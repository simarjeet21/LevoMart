import Footer from "./Footer";
import Navbar from "./Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-beige">
      <Navbar />
      <main className="flex-1  mx-auto w-full ">{children}</main>
      <Footer />
    </div>
  );
}
