const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex flex-col mx-5 md:mx-20 lg:mx-40">
      <nav>
      </nav>
      <main className="flex flex-col items-center justify-center">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center px-20">
        &copy; 2025 Pokédex App
      </footer>
    </div>
  );
};

export default Layout;
