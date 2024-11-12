import { useContext } from "react";
// @ts-ignore
import DrillbitAvatar from "../../assets/images/drillbit-avatar.png";
// @ts-ignore
import X from "../../assets/images/X.png";
import { AppContext } from "../../App";

const Login = () => {
  const { twitterAuth } = useContext(AppContext);
  const { signInWithTwitter } = twitterAuth;

  return (
    <div className="flex flex-1 h-screen justify-center items-center">
      <div className="items-center gap-[40px] flex flex-col backdrop-blur-xl bg-[#ffffff59] rounded-[20px] px-[120px] py-[50px]">
        <img
          src={"./payman-black.png"}
          style={{ height: 40, width: 180, marginBottom: 10 }}
        />
        <img src={DrillbitAvatar} style={{ height: 320, width: 320 }} />
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-bold">Login to attend </span>
          <span className="text-4xl  text-white  font-bold">
            Drillbit’s Beach Bash
          </span>
        </div>
        <div
          onClick={signInWithTwitter}
          className="flex bg-black rounded-md w-[300px] h-[52px] justify-center items-center gap-2.5 cursor-pointer"
        >
          <img src={X} style={{ height: 32, width: 32 }} />
          <span className="text-white">Login with X</span>
        </div>
      </div>
    </div>
  );
};

export { Login };
