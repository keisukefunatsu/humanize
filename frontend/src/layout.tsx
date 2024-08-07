// Layout.tsx
import React, { ReactNode, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { SignInWithWorldID } from "./components/IDKitWidget";
import { useEthersSigner } from "./libs/ethers";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const signer = useEthersSigner();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200 w-full">
        <h1 className="text-2xl font-bold">Humanize</h1>
        <div className="flex items-center space-x-4">
          {signer && (
            <SignInWithWorldID walletAddress={signer.address}></SignInWithWorldID>
          )}
          {/* w3m-button コンポーネント */}
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
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white shadow-lg md:shadow-none border-r md:border-r-0 border-gray-200 z-50 md:z-auto fixed md:relative h-full md:h-auto`}
        >
          <div className="flex flex-col h-full md:h-auto">
            <nav className="flex flex-col p-4 space-y-2">
              <a
                href="#"
                className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded"
              >
                {/* アイコンスペース */}
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full"></span>
                Optimism
              </a>
              <a
                href="#"
                className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded"
              >
                {/* アイコンスペース */}
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full"></span>
                Base
              </a>
              <a
                href="#"
                className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded"
              >
                {/* アイコンスペース */}
                <span className="mr-2 w-6 h-6 bg-gray-300 rounded-full"></span>
                Ethereum
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
