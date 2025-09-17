import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-10 h-full flex flex-col items-center justify-center px-3 md:px-10 xl:px-30 bg-[#0A0F2F] pt-20 pb-30 overflow-hidden">
      <img
        className="absolute z-0 object-cover h-350 w-350 -top-30"
        src="/background/pokeball-bg.svg"
        alt="pokeball"
      />
      <nav className="relative pb-10">
        <Link to="/">
          <img
            className="h-10"
            src="/logo/pokemon-logo.png"
            alt="pokemon-logo"
          />
        </Link>
      </nav>
      <main className="relative z-10 flex flex-col items-center justify-center w-fit">
        {children}
      </main>
    </div>
  );
};

export default Layout;
