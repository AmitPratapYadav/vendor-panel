import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  ShoppingCart,
  Package,
  User,
  X,
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {

  const handleClose = () => {
    if (onClose) onClose()
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200
     ${
       isActive
         ? "bg-[#9BCBBF] text-[#1E293B] font-semibold"
         : "text-[#94A3B8] hover:bg-[#9BCBBF] hover:text-[#1E293B]"
     }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1E293B]
        flex flex-col justify-between
        z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >

        {/* TOP */}
        <div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white lg:hidden"
          >
            <X size={22} />
          </button>

          <div className="p-6 flex justify-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>

          <nav className="px-4">

            <NavLink to="/" end className={linkClass} onClick={handleClose}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink
              to="/incoming-orders"
              className={linkClass}
              onClick={handleClose}
            >
              <Inbox size={20} />
              Incoming Orders

              {/* BADGE FIX */}
              <span className="ml-auto bg-[#EF4444] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                3 New
              </span>
            </NavLink>

            <NavLink
              to="/order-management"
              className={linkClass}
              onClick={handleClose}
            >
              <ShoppingCart size={20} />
              Order Management
            </NavLink>

            <NavLink
              to="/product-management"
              className={linkClass}
              onClick={handleClose}
            >
              <Package size={20} />
              Product Management
            </NavLink>

            <NavLink
              to="/profile-kyc"
              className={linkClass}
              onClick={handleClose}
            >
              <User size={20} />
              Profile & KYC
            </NavLink>

          </nav>
        </div>

        {/* PROFILE */}
        <div className="p-4 border-t border-[#334155]">
          <NavLink
            to="/apex-profile"
            onClick={handleClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-[#9BCBBF] text-[#1E293B]"
                  : "text-white hover:bg-[#9BCBBF] hover:text-[#1E293B]"
              }`
            }
          >
            <div className="w-10 h-10 rounded-full bg-[#9BCBBF] flex items-center justify-center">
              <User size={18} className="text-[#1E293B]" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Apex Printing Solutions
              </p>
              <p className="text-xs text-[#CBD5E1]">
                apex@print.com
              </p>
            </div>
          </NavLink>
        </div>

      </div>
    </>
  );
}

export default Sidebar;