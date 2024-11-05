import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { LeaderboardTab } from "./components/Leaderboard/LeaderboardTab";
import { MetricsTab } from "./components/Metrics/MetricsTab";
import { Footer } from "./components/ui/footer";
import { BeachBarTab } from "./components/BeachBar/BeachBarTab";
import Triangle from "./assets/svg/Triangle.svg";

const DrillbitChat: React.FC = () => {
  return (
    <>
      <div
        id="outer"
        className="h-screen flex flex-col w-full md:pt-10 items-center"
      >
        <span className="lg:text-[60px] text-[25px] lg:leading-[92px] mt-[20px] font-bold text-center font-coiny text-white animate-neon-pulse">
          🏖️ Drillbit's Beach Bash 🍹
        </span>
        <div
          id="inner"
          className="w-full md:max-w-[1140px] flex flex-col flex-1 shadow-lg rounded-3xl lg:border-4 lg:border-[rgba(255,255,255,0.3)] sm:rounded-lg lg:backdrop-blur lg:mb-10"
        >
          <Tabs defaultValue="beachbar" className="w-full flex flex-col flex-1">
            {({
              activeTab,
              setActiveTab,
            }: {
              activeTab: string;
              setActiveTab: (value: string) => void;
            }) => (
              <>
                {/* Tabs */}
                <TabsList className="grid w-full grid-cols-3 mb-3 border-b-4 border-b-[rgba(255,255,255,0.3)]">
                  {["beachbar", "metrics", "leaderboard"].map((tabValue) => (
                    <TabsTrigger
                      key={tabValue}
                      value={tabValue}
                      className={`p-4 ${
                        activeTab === tabValue && "pb-0"
                      } md:text-lg text-sm tracking-widest drop-shadow-lg font-semibold text-white flex flex-col  items-center`}
                    >
                      {tabValue === "beachbar" && "BEACH BASH"}
                      {tabValue === "metrics" && "METRICS"}
                      {tabValue === "leaderboard" && "LEADERBOARD"}

                      {activeTab === tabValue && (
                        <img src={Triangle} className="mt-[10px]" alt="" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Beachbar Tab */}
                <TabsContent
                  value="beachbar"
                  className="w-full md:px-6 flex-grow flex flex-col md:max-h-[calc(100vh-300px)] max-h-[calc(100vh-200px)]"
                >
                  <BeachBarTab />
                </TabsContent>

                {/* Metrics Tab Content */}
                <TabsContent
                  value="metrics"
                  className="w-full px-6 md:max-h-[calc(100vh-300px)] max-h-[calc(100vh-200px)] overflow-y-scroll"
                >
                  <MetricsTab />
                </TabsContent>

                {/* Leaderboard Tab Content */}
                <TabsContent
                  value="leaderboard"
                  className="w-full pl-6 pr-6 pt-4"
                >
                  <LeaderboardTab />
                </TabsContent>
              </>
            )}
          </Tabs>

          {/* Powered by Payman footer */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DrillbitChat;
