import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-screen bg-base-100 flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {showSidebar && (
          <aside className="hidden lg:block flex-shrink-0">
            <Sidebar />
          </aside>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-full w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;