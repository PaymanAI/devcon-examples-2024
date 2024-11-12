export const bartender = () => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Drinks order list</title>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossorigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
          rel='stylesheet'
        />
        <script src='https://unpkg.com/htmx.org@1.9.2' />
        <script src='https://unpkg.com/htmx.org@1.9.12/dist/ext/json-enc.js' />
        <link href='/styles/output.css' rel='stylesheet' />
        <script src='/public/lightbeer.js' />
      </head>

      <body class="m-0 flex h-screen items-center justify-center bg-[#f0f0f0] bg-[url('/public/buzzed-bg.jpg')] bg-cover bg-no-repeat p-0 font-['DM_Sans']">
        <div class='fixed inset-0 bottom-[100px] flex flex-col items-center justify-center overflow-scroll'>
          <div class="relative mt-10 h-full w-full max-w-[600px] overflow-hidden rounded-[20px] border-4 border-white/80 bg-[url('/public/bg-blur.jpg')] bg-cover bg-no-repeat shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div class='text-center font-bold text-2xl text-white leading-[31.25px]'>
              Buzzed Lightbeer Drink Orders
            </div>
            <ul
              id='order-list'
              class='h-full list-none overflow-scroll p-0'
              hx-get='/orders'
              hx-swap='innerHTML'
              hx-target='#order-list'
              hx-trigger='load'
            />
          </div>
        </div>
      </body>
    </html>
  )
}
