import { Progress } from "../ui/progress";

export const DrunkoMeter = ({ drunkLevel }: { drunkLevel: number }) => {
  return (
    <div>
      <div className="text-base font-semibold text-black">
        Drunk-o-Meter Level
        <span className="text-sm text-black">{" "}{drunkLevel}/25</span>
      </div>
      <div className="pt-0 pb-4 px-1">
        <Progress
          value={drunkLevel * 4}
          className="w-full h-2 bg-gradient-to-r from-orange-300 to-pink-300"
        />
      </div>
    </div>
  );
};
