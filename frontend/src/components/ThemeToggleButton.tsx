"use client";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { atom, useAtom } from "jotai";
import { ThemeAtom } from "./ThemeContextProvider";

const ThemeToggleButton = () => {
  const [theme, setTheme] = useAtom(ThemeAtom);

  return (
    <IconButton
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      sx={{ color: "white" }}
    >
      {theme === "light" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggleButton;
