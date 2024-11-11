export const index = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/public/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/public/favicon-16x16.png"
        />
        <link rel="manifest" href="/public/site.webmanifest" />
        <link rel="apple-touch-icon" href="logo192.png" />
        <meta name="description" content="Get our bartender Buzzed Lightbeer to prepare a personalized drink for you" />
        <title>Buzzed Lightbeer | Payman</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="true"
        />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/htmx.org@1.9.2"></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/json-enc.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="/public/lightbeer.js"></script>
      </head>

      <body class="font-['DM_Sans'] m-0 p-0 flex justify-center items-center h-screen bg-[#f0f0f0] bg-[url('/public/buzzed-bg.jpg')] bg-no-repeat bg-cover">
        <div class="fixed inset-0 bottom-[70px] overflow-scroll flex justify-center items-center flex-col">
          <div class="flex justify-center">
            <img src="/public/buzzed-logo.png" alt="Buzz Lightbeer" />
          </div>

          <div class="h-full w-full max-w-[600px] rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] border-4 border-white/80 relative bg-[url('/public/bg-blur.jpg')] bg-no-repeat bg-cover overflow-hidden">
            <div class="flex justify-between bg-black rounded-t-[20px]">
              <span class="p-2.5 uppercase md:text-base text-xs leading-[26px] tracking-widest text-white">
                Total Tips: USDC
                <span
                  id="budget"
                  hx-get="/tips"
                  hx-swap="innerHTML"
                  hx-trigger="every 5s"
                  hx-target="#budget"
                ></span>
              </span>
              <span class="p-2.5 uppercase md:text-base text-xs leading-[26px] tracking-widest text-white">
                Drinks Ordered:
                <span
                  id="count"
                  hx-get="/count"
                  hx-swap="innerHTML"
                  hx-trigger="every 5s"
                  hx-target="#count"
                ></span>
              </span>
            </div>

            <div id="result" class="z-10 overflow-hidden">
              <form
                hx-post="/start"
                hx-target="#result"
                hx-swap="innerHtml"
                class="flex flex-col justify-center items-center p-5 w-full"
              >
                <button
                  type="submit"
                  class="px-5 py-2.5 bg-[#68F0FF] hover:bg-[rgb(212,244,255)] text-black border-none rounded-md cursor-pointer text-base transition-colors duration-200 flex items-center gap-2 htmx-request:opacity-50"
                  hx-indicator="#spinner"
                >
                  <svg
                    id="spinner"
                    class="hidden transition-[display] duration-500 ease-in mx-auto htmx-request:block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <title>Loading</title>
                    <path
                      fill="currentColor"
                      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                      opacity="0.25"
                    />
                    <circle cx="12" cy="2.5" r="1.5" fill="currentColor">
                      <animateTransform
                        attributeName="transform"
                        dur="0.75s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;360 12 12"
                      />
                    </circle>
                  </svg>
                  <div class="htmx-request:hidden">
                    Chat with Buzzed Lightbeer
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="absolute bottom-0 flex flex-row justify-center items-center gap-2.5 mb-5 bg-black/50 px-7 py-1.5 rounded-[99px] text-white">
          <div class="text-center text-white text-xs sm:text-sm">
            Powered by{" "}
            <a href="https://paymanai.com>">
              <img
                src="/public/payman-white.png"
                alt="Payman AI"
                class="inline-block h-4 pl-1 mt-[2px]"
              />
            </a>
            <a href="https://coinbase.com>">
              <img
                src="/public/coinbase.png"
                alt="Coinbase"
                class="px-2 inline-block h-4"
              />
            </a>
          </div>
        </div>
      </body>
    </html>
  );
};
