import React, { useState, useEffect, useRef } from "react";
import { Menu as MenuIcon, ChevronDown, User } from "lucide-react";

function Navbar({ setIsSidebarOpen, isSidebarOpen, onContentChange, variant, size }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const navRef = useRef(null);

  const baseLinks = [
    {
      name: "NEW ORDER",
      dropdown: [{ name: "By Product" }, { name: "By Distributor" }, { name: "Bulk Order" }, { name: "Draft Orders" }, { name: "Mapping" }],
    },
    {
      name: "PREVIOUS ORDERS",
      dropdown: [{ name: "By Date" }, { name: "By Distributor" }, { name: "By product" }, { name: "Scheme items" }, { name: "Short Supply" }],
    },
    {
      name: "DISTRIBUTORS",
      dropdown: [{ name: "Connected Distributors" }, { name: "All Distributors" }, { name: "Refer Distributors" }],
    },
    {
      name: "PRODUCT SEARCH",
      dropdown: [{ name: "By Name" }, { name: "By SKU" }],
    },
    {
      name: "SHORTAGE BOOK",
      dropdown: [{ name: "Shortage Book" }, { name: "My SB Products" }],
    },
  ];

  // If distributor, insert RECEIVED ORDERS after SHORTAGE BOOK
  const navLinks = (() => {
    const links = [...baseLinks];
    if (variant === "distributor") {
      const insertIndex = links.findIndex(l => l.name === "SHORTAGE BOOK");
      const receivedOrders = { name: "RECEIVED ORDERS", dropdown: [{ name: "By Date" }] };
      if (insertIndex >= 0) {
        links.splice(insertIndex + 1, 0, receivedOrders);
      } else {
        links.push(receivedOrders);
      }
    }
    return links;
  })();

  const handleDropdownClick = (itemName) => {
    // If clicking the same item, toggle it
    if (activeDropdown === itemName) {
      setActiveDropdown(null);
    } else {
      // If clicking a different item, close the previous one and open the new one
      setActiveDropdown(itemName);
    }
  };

  const handleDropdownHover = (itemName) => {
    // Close any previously opened dropdown when hovering over a new item
    if (activeDropdown !== itemName) {
      setActiveDropdown(null);
    }
    setHoveredDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    setHoveredDropdown(null);
  };

  const handleLinkClick = (name) => {
    onContentChange(name, "", name);
    setActiveDropdown(null); // Close dropdown after clicking a link
    setHoveredDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setHoveredDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerPaddingClass = size === "compact" ? "p-3" : "p-4";
  const buttonTextSizeClass = size === "compact" ? "text-xs" : "text-sm";
  const logoTextSizeClass = size === "compact" ? "text-lg" : "text-xl";

  return (
    <header ref={navRef} className={`bg-white border-b border-gray-200 shadow-sm ${headerPaddingClass} sticky top-0 z-40`}>
      <div className="flex items-center justify-between">
        {/* Left side: Menu button + Dashboard */}
        <div className="flex items-center space-x-2">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              <MenuIcon size={24} />
            </button>
          )}

          <button
            className={`${logoTextSizeClass} font-semibold text-gray-800 cursor-pointer`}
            onClick={() => onContentChange("Dashboard Overview", "", "Dashboard Overview")}
          >
            Logo here
          </button>
        </div>

        {/* Center / Right side: Nav Links */}
        <nav className="flex items-center space-x-2 lg:space-x-4">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                onClick={() => handleDropdownClick(link.name)}
                onMouseEnter={() => handleDropdownHover(link.name)}
                onMouseLeave={handleDropdownLeave}
                className={`px-3 py-2 ${buttonTextSizeClass} font-medium rounded-md flex items-center space-x-1 cursor-pointer transition-colors duration-200 ${
                  activeDropdown === link.name || hoveredDropdown === link.name ? "bg-purple-100 text-purple-600" : "text-gray-700 hover:bg-gray-200 hover:text-blue-600"
                }`}
              >
                <span>{link.name}</span>
                {link.dropdown && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${activeDropdown === link.name || hoveredDropdown === link.name ? "rotate-180" : "rotate-0"}`}
                  />
                )}
              </button>

              {link.dropdown && (activeDropdown === link.name || hoveredDropdown === link.name) && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  onMouseEnter={() => handleDropdownHover(link.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {link.dropdown.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => handleLinkClick(subItem.name)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-blue-500 rounded-md cursor-pointer"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: User */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Name</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User size={18} />
            </div>
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
