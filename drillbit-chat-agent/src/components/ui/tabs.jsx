import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext();

const Tabs = ({ children, defaultValue, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs ${className}`}>
        {typeof children === "function"
          ? children({ activeTab, setActiveTab })
          : children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>;
};

const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={`tabs-trigger ${
        activeTab === value ? "active" : ""
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className }) => {
  const { activeTab } = useContext(TabsContext);
  if (value !== activeTab) return null;
  return <div className={`tabs-content ${className}`}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
