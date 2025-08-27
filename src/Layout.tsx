const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4 px-20">
        <nav>
          <h1 className="text-2xl font-bold">Pokédex</h1>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center mx-20">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center px-20">
        &copy; 2025 Pokédex App
      </footer>
    </div>
  );
};

export default Layout;
