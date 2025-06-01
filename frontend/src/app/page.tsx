import { GlobalContainer } from "@/components/GlobalContainer";
import { Button } from "@mui/material";
import Link from "next/link";
import { SearchEmployees } from "../components/SearchEmployees";

export default function Home() {
  return (
    <GlobalContainer>
      <Link href="/register-employee">
        <Button variant="contained">登録</Button>
      </Link>
      <SearchEmployees />
    </GlobalContainer>
  );
}
