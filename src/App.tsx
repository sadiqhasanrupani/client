import { Routes } from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
