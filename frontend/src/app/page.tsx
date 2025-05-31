import { GlobalContainer } from "@/components/GlobalContainer";
import { SearchEmployees } from "../components/SearchEmployees";

export default function Home() {
  return (
    <GlobalContainer>
      <SearchEmployees />
    </GlobalContainer>
  );
}
