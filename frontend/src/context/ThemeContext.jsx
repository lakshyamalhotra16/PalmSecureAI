import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const DEFAULT_THEME = "professional";

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {

        return localStorage.getItem("theme") || DEFAULT_THEME;

    });

    useEffect(() => {

        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem("theme", theme);

    }, [theme]);

    const toggleTheme = () => {

        if (theme === "dark") {

            setTheme("light");

        }

        else if (theme === "light") {

            setTheme("professional");

        }

        else {

            setTheme("dark");

        }

    };

    return (

        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}