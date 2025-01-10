import dynamic from "next/dynamic";
const ModeToggle = dynamic(
  () => import("@/components/mode-toggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  return (
    <header className="flex flex-col space-y-4 z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between gap-2">
        <h1 className="text-2xl font-bold">Logo</h1>
        <ModeToggle />
      </nav>
    </header>
  );
}

export default Header;
