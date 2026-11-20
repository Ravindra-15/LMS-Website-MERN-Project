import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { createElement } from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "dashboard", label: "Dashboard", icon: ChartNoAxesColumn },
  { to: "course", label: "Courses", icon: SquareLibrary },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
    isActive
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-200 dark:hover:bg-gray-800"
  }`;

const Sidebar = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[250px] shrink-0 border-r border-gray-300 dark:bg-[#141414] dark:border-gray-700 bg-[#f0f0f0] p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="space-y-2">
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {createElement(icon, { size: 20 })}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Tabs for tablets and phones (sidebar is hidden there) */}
      <nav className="lg:hidden flex gap-2 border-b border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-[#141414] px-4 py-2">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {createElement(icon, { size: 18 })}
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 min-w-0 p-4 md:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
