import PeopleIcon from "@mui/icons-material/People";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

import ThemeToggleButton from "./ThemeToggleButton";

export interface GlobalHeaderProps {
  title: string;
}

export function GlobalHeader({ title }: GlobalHeaderProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(45deg, rgb(0, 91, 172), rgb(94, 194, 198))",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <PeopleIcon fontSize={"large"} sx={{ mr: 2 }} />
            </Link>
            <Link href="/">
              <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
            </Link>
          </Box>
          <ThemeToggleButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
