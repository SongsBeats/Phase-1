import React, { useEffect, useState } from "react";
import { useVerifyRouteQuery } from "../../../services/LoginRegisterApi";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../retailer/sidebar-pages/Sidebar";
import Navbar from "../retailer/nav-pages/Navbar";
import ContentDisplay from "../retailer/ContentDisplay";

function DistributorDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data, isLoading, error } = useVerifyRouteQuery(userId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [content, setContent] = useState({
    title: "Welcome to the Dashboard!",
    body:
      "This is the main content area. Select a link from the sidebar or navbar to view different content.",
    component: "Dashboard Overview",
  });

  const handleContentChange = (title, body, componentName) => {
    setContent({
      title,
      body,
      component: componentName,
    });
  };

  // Redirect if unauthorized
  useEffect(() => {
    if (!isLoading && (error || !data?.status)) {
      navigate("/unified-health-tech/login");
    }
  }, [error, data, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onContentChange={handleContentChange}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
        {/* Navbar */}
        <Navbar
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          onContentChange={handleContentChange}
          variant="distributor"
          size="compact"
        />

        {/* Content Section */}
        <div className="p-8 flex-1">
          <ContentDisplay content={content} />
        </div>
      </div>
    </div>
  );
}

export default DistributorDashboard;
