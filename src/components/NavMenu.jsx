import { useEffect, useRef, useState } from "react";
import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "world-map", label: "World Map" },
  { key: "daily", label: "Daily Challenge" },
  { key: "sentences", label: "Sentences" },
  { key: "flashcards", label: "Flash Cards" },
  { key: "mathmode", label: "Math Mode" },
  { key: "dictionary", label: "Dictionary" }
];

export default function NavMenu({ onNavigate, onReset, activeScreen }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleOutsideClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  function goTo(key) {
    setOpen(false);
    onNavigate(key);
  }

  function handleReset() {
    setOpen(false);

    if (window.confirm("Reset all progress? This can't be undone.")) {
      onReset();
    }
  }

  return (
    <div className="nav-menu" ref={rootRef}>
      <button
        type="button"
        className="round-icon-button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open navigation menu"
      >
        <AssetImage
          src={NWQ_ASSETS.navigation.menu}
          decorative
          className="topbar-icon-img"
        />
      </button>

      {open && (
        <div className="nav-menu-dropdown" role="menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              className={`nav-menu-item ${
                activeScreen === item.key ? "nav-menu-item-active" : ""
              }`}
              onClick={() => goTo(item.key)}
            >
              {item.label}
            </button>
          ))}

          <div className="nav-menu-divider" />

          <button
            type="button"
            role="menuitem"
            className="nav-menu-item nav-menu-item-danger"
            onClick={handleReset}
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}
