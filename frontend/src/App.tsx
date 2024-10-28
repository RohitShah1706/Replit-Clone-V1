import { useEffect } from "react";

import { ThemeModeToggle } from "./components/custom/theme-mode-toggle";
import { ThemeProvider } from "./components/providers/theme-provider";
import { useSocket } from "./hooks/use-socket";
import { TerminalComponent } from "./components/custom/termina";

function App() {
  // const socket = useSocket("proj-aaaa0eef0b1a40188a4299b506a08dc4");
  const socket = useSocket("proj-75074a23ef3144bdb2b51c428be8c9b9");

  useEffect(() => {
    if (socket) {
      socket.on("loaded", (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="replit-clone-theme">
        <div className="flex flex-col">
          <ThemeModeToggle />
          {socket && <TerminalComponent socket={socket} />}
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
