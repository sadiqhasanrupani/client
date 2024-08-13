import { Routes } from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes />
      <Toaster richColors position="bottom-left" />
    </>
  );
}

export default App;
