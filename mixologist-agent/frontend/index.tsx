export const index = () => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/public/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/public/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/public/favicon-16x16.png'
        />
        <link rel='manifest' href='/public/site.webmanifest' />
        <link rel='apple-touch-icon' href='logo192.png' />
        <meta
          name='description'
          content='Get our bartender Buzzed Lightbeer to prepare a personalized drink for you'
        />
        <title>Buzzed Lightbeer | Payman</title>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossorigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&display=swap'
          rel='stylesheet'
        />
        <script src='https://unpkg.com/htmx.org@1.9.2' />
        <script src='https://unpkg.com/htmx.org@1.9.12/dist/ext/json-enc.js' />
        <script src='https://cdn.tailwindcss.com' />
        <script src='/public/lightbeer.js' />
      </head>

      <body class="m-0 flex h-screen items-center justify-center bg-[#f0f0f0] bg-[url('/public/buzzed-bg.jpg')] bg-cover bg-no-repeat p-0 font-['DM_Sans']">
        <div class='fixed inset-0 bottom-[70px] flex flex-col items-center justify-center overflow-scroll'>
          <div class='flex justify-center'>
            <img src='/public/buzzed-logo.png' alt='Buzz Lightbeer' />
          </div>

          <div class="relative h-full w-full max-w-[600px] overflow-hidden rounded-[20px] border-4 border-white/80 bg-[url('/public/bg-blur.jpg')] bg-cover bg-no-repeat shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div class='flex justify-between rounded-t-[20px] bg-black'>
              <span class='p-2.5 text-white text-xs uppercase leading-[26px] tracking-widest md:text-base'>
                Total Tips: USDC
                <span
                  id='budget'
                  hx-get='/tips'
                  hx-swap='innerHTML'
                  hx-trigger='every 5s'
                  hx-target='#budget'
                />
              </span>
              <span class='p-2.5 text-white text-xs uppercase leading-[26px] tracking-widest md:text-base'>
                Drinks Ordered:
                <span
                  id='count'
                  hx-get='/count'
                  hx-swap='innerHTML'
                  hx-trigger='every 5s'
                  hx-target='#count'
                />
              </span>
            </div>

            <div id='result' class='z-10 overflow-hidden'>
              <form
                hx-post='/start'
                hx-target='#result'
                hx-swap='innerHtml'
                class='flex w-full flex-col items-center justify-center p-5'
              >
                <button
                  type='submit'
                  class='flex cursor-pointer items-center gap-2 rounded-md border-none bg-[#68F0FF] px-5 py-2.5 text-base text-black htmx-request:opacity-50 transition-colors duration-200 hover:bg-[rgb(212,244,255)]'
                  hx-indicator='#spinner'
                >
                  <svg
                    id='spinner'
                    class='mx-auto htmx-request:block hidden transition-[display] duration-500 ease-in'
                    xmlns='http://www.w3.org/2000/svg'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <title>Loading</title>
                    <path
                      fill='currentColor'
                      d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
                      opacity='0.25'
                    />
                    <circle cx='12' cy='2.5' r='1.5' fill='currentColor'>
                      <animateTransform
                        attributeName='transform'
                        dur='0.75s'
                        repeatCount='indefinite'
                        type='rotate'
                        values='0 12 12;360 12 12'
                      />
                    </circle>
                  </svg>
                  <div class='htmx-request:hidden'>
                    Chat with Buzzed Lightbeer
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class='absolute bottom-0 mb-5 flex flex-row items-center justify-center gap-2.5 rounded-[99px] bg-black/50 px-7 py-1.5 text-white'>
          <div class='text-center text-white text-xs sm:text-sm'>
            Powered by
            <a href='https://paymanai.com>'>
              <img
                src='/public/payman-white.png'
                alt='Payman AI'
                class='mt-[2px] inline-block h-4 pl-1'
              />
            </a>
            <a href='https://coinbase.com>'>
              <img
                src='/public/coinbase.png'
                alt='Coinbase'
                class='inline-block h-4 px-2'
              />
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
