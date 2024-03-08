import { Container } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { ReactNode } from "react";

function Page({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Toolbar />
      {children}
    </Container>
  );
}
export default Page;
