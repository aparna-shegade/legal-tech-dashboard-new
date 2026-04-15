import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Legal Tech Dashboard
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={isActive("/")} >
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/cases" className={isActive("/cases")}>
              Cases
            </Link>
          </li>
          <li>
            <Link to="/clients" className={isActive("/clients")}>
              Clients
            </Link>
          </li>
          <li>
            <Link to="/tasks" className={isActive("/tasks")}>
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/documents" className={isActive("/documents")}>
              Documents
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;