"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { atom, useAtom } from "jotai";
import { type ReactNode, useEffect } from "react";

export const ThemeAtom = atom<"light" | "dark">("light");

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useAtom(ThemeAtom);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark") setTheme("dark");
  }, [setTheme]); // 入れる意味がないのですがbiomeに怒られるので...

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
