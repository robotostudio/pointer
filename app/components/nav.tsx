import Link from "next/link";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
};

export function Navbar() {
  return (
    <aside className="container">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative flex flex-row items-start md:relative"
          id="nav"
        >
          <div className="flex flex-row gap-2">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  className="relative m-1 flex py-1 align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
                  href={path}
                  key={path}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
