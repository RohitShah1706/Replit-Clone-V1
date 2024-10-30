import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./components/providers/theme-provider";
import CodingPage from "./pages/CodingPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="replit-clone-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/coding/:projectId" element={<CodingPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
