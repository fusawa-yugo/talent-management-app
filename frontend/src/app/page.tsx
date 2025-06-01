import { GlobalContainer } from "@/components/GlobalContainer";
import { SearchEmployees } from "../components/SearchEmployees";
import Link from "next/link";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <GlobalContainer>
      <Link href="/register-employee">
        <Button variant="contained">
          登録
        </Button>
      </Link>
      <SearchEmployees />
    </GlobalContainer>
  );
}
