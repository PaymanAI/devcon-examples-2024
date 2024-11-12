import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
   activeTab: string;
   setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Custom hook for using tabs context
const useTabsContext = () => {
   const context = useContext(TabsContext);
   if (!context) {
       throw new Error("Tabs components must be used within a Tabs provider");
   }
   return context;
};

interface TabsProps {
   children: React.ReactNode | ((props: TabsContextType) => React.ReactNode);
   defaultValue: string;
   className?: string;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className = '' }) => {
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

interface TabsListProps {
   children: React.ReactNode;
   className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
   return <div className={`tabs-list ${className}`}>{children}</div>;
};

interface TabsTriggerProps {
   value: string;
   children: React.ReactNode;
   className?: string;
   disabled?: boolean;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
   value, 
   children, 
   className = '',
   disabled = false 
}) => {
   const { activeTab, setActiveTab } = useTabsContext();
   
   return (
       <button
           className={`
               tabs-trigger 
               ${activeTab === value ? "active" : ""} 
               ${disabled ? "opacity-50 cursor-not-allowed" : ""}
               ${className}
           `}
           onClick={() => !disabled && setActiveTab(value)}
           disabled={disabled}
           type="button"
           role="tab"
           aria-selected={activeTab === value}
           aria-controls={`panel-${value}`}
           tabIndex={activeTab === value ? 0 : -1}
       >
           {children}
       </button>
   );
};

interface TabsContentProps {
   value: string;
   children: React.ReactNode;
   className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ 
   value, 
   children, 
   className = '' 
}) => {
   const { activeTab } = useTabsContext();
   
   if (value !== activeTab) return null;
   
   return (
       <div 
           className={`tabs-content ${className}`}
           role="tabpanel"
           id={`panel-${value}`}
           aria-labelledby={`trigger-${value}`}
           tabIndex={0}
       >
           {children}
       </div>
   );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };