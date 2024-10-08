// Layout.tsx
import React, { ReactNode, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { SignInWithWorldID } from "./components/IDKitWidget";
import { useEthersSigner } from "./libs/ethers";

interface LayoutProps {
  children: ReactNode;
  onChainChange: (chain: string) => void; // Add this prop
}

const Layout: React.FC<LayoutProps> = ({ children, onChainChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChain, setActiveChain] = useState<string>("optimism"); // Add this state

  const signer = useEthersSigner();

  const handleChainClick = (chain: string) => {
    setActiveChain(chain);
    onChainChange(chain);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200 w-full">
        <h1 className="text-2xl font-bold">Humanize</h1>
        <div className="flex items-center space-x-4">
          {signer && (
            <SignInWithWorldID
              walletAddress={signer.address}
            ></SignInWithWorldID>
          )}
          <div className="hidden md:block">
            <w3m-button></w3m-button>
          </div>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaTimes className="w-6 h-6" aria-hidden="true" />
            ) : (
              <FaBars className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-grow">
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white shadow-lg md:shadow-none border-r md:border-r-0 border-gray-200 z-50 md:z-auto fixed md:relative h-full md:h-auto`}
        >
          <div className="flex flex-col h-full md:h-auto">
            <nav className="flex flex-col p-4 space-y-2">
              <button
                className={`flex items-center text-gray-700 p-2 rounded ${
                  activeChain === "optimism"
                    ? "bg-gray-300"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => handleChainClick("optimism")}
              >
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                  >
                    <path
                      fill="#f95858"
                      fill-rule="evenodd"
                      d="M4.731 16.245q.885.633 2.273.633q1.677 0 2.68-.758q1.002-.768 1.41-2.318q.245-.95.42-1.957q.057-.36.058-.6q0-.79-.408-1.356a2.43 2.43 0 0 0-1.119-.86q-.711-.294-1.608-.294q-3.297 0-4.09 3.11q-.28 1.143-.431 1.957a4 4 0 0 0-.059.61q0 1.188.874 1.833m4.207-2.51c-.223.865-.838 1.43-1.771 1.43c-.923 0-1.238-.625-1.072-1.43q.21-1.097.42-1.856c.24-.935.806-1.43 1.77-1.43c.92 0 1.22.616 1.061 1.43q-.14.793-.408 1.855m3.531 3.062q.069.08.193.08h1.542a.34.34 0 0 0 .215-.08a.33.33 0 0 0 .125-.21l.487-2.28h1.568c.99 0 1.764-.48 2.331-.907q.862-.64 1.145-1.978a2.8 2.8 0 0 0 .068-.605q0-1.011-.77-1.547q-.76-.535-2.018-.535H14.34a.34.34 0 0 0-.216.082a.34.34 0 0 0-.124.21l-1.565 7.56a.28.28 0 0 0 .034.21m5.51-5.398c-.142.623-.685 1.193-1.323 1.193h-1.303l.449-2.143h1.36c.463 0 .85.092.85.601q0 .15-.033.35"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Optimism
              </button>
              <button
                className={`flex items-center text-gray-700 p-2 rounded ${
                  activeChain === "base" ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => handleChainClick("base")}
              >
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#5862f9"
                      d="M11.986 20C16.412 20 20 16.418 20 12s-3.588-8-8.014-8A8.01 8.01 0 0 0 4 11.328h10.593v1.345H4C4.342 16.776 7.787 20 11.986 20"
                    />
                  </svg>
                </span>
                Base
              </button>
              <button
                className={`flex items-center text-gray-700 p-2 rounded ${
                  activeChain === "polygon"
                    ? "bg-gray-300"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => handleChainClick("polygon")}
              >
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e853f4"
                      d="m15.88 14.86l3.794-2.165a.64.64 0 0 0 .326-.558v-4.33a.64.64 0 0 0-.326-.556L15.88 5.086a.66.66 0 0 0-.65 0L11.432 7.25a.64.64 0 0 0-.325.557v7.737l-2.662 1.517l-2.661-1.517v-3.036l2.661-1.517l1.755 1.001V9.958l-1.43-.816a.66.66 0 0 0-.65 0l-3.796 2.165a.64.64 0 0 0-.325.557v4.33c0 .229.124.442.325.557l3.796 2.165c.2.114.45.114.65 0l3.796-2.165a.64.64 0 0 0 .325-.557V8.455l.048-.026l2.613-1.49l2.661 1.516v3.036l-2.661 1.517l-1.753-.999v2.037l1.427.814a.66.66 0 0 0 .651 0z"
                    />
                  </svg>
                </span>
                Polygon
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-grow p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
