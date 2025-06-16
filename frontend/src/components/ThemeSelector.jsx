import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants/index";
import { useThemeStore } from "../../store/useThemeStore";

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle tooltip tooltip-bottom"
        data-tip="Change theme"
      >
        <PaletteIcon className="size-5" />
      </button>

      {/* DROPDOWN CONTENT */}
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-3 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-60 border border-base-content/10 grid grid-cols-2 gap-2"
      >
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`w-full p-3 rounded-xl flex flex-col items-center gap-2 transition-all
              ${
                theme === themeOption.name
                  ? "ring-2 ring-primary ring-offset-2 transform scale-[1.02]"
                  : "hover:scale-105 hover:bg-base-content/5"
              }`}
            onClick={() => setTheme(themeOption.name)}
          >
            {/* THEME PREVIEW COLORS */}
            <div className="w-full h-8 rounded-lg flex overflow-hidden shadow-md">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <span className="text-xs font-medium mt-1">
              {themeOption.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default ThemeSelector;
