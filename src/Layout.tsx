const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-full flex flex-col bg-blue-200 px-5 md:px-20 xl:px-60">
      <nav>
      </nav>
      <main className="flex flex-col items-center justify-center">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center px-20 absolute bottom-0 w-full -mx-5 md:-mx-20 xl:-mx-60">
        &copy; 2025 Pokédex App
      </footer>
    </div>
  );
};

export default Layout;
