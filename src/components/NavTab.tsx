import { NavLink } from "react-router"
import "../styles/navtab.style.scss"
import { useAuth } from "../hooks/AuthProvider"

function NavTab() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="nav">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>

      {
        isAuthenticated ? 
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
        :
          <NavLink to="/auth/signin" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
      }
      
      <NavLink to="/surveys" className={({ isActive }) => isActive ? "active" : ""}>Surveys</NavLink>
      <NavLink to="/surveys/self" className={({ isActive }) => isActive ? "active" : ""}>My surveys</NavLink>
    </nav>
  )
}

export default NavTab
