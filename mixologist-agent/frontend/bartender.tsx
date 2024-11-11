export const bartender = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Drinks order list</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/htmx.org@1.9.2"></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/json-enc.js"></script>
        <link href="/styles/output.css" rel="stylesheet" />
        <script src="/public/lightbeer.js"></script>
      </head>

      <body class="font-['DM_Sans'] m-0 p-0 flex justify-center items-center h-screen bg-[#f0f0f0] bg-[url('/public/buzzed-bg.jpg')] bg-no-repeat bg-cover">
        <div class="fixed inset-0 bottom-[100px] overflow-scroll flex justify-center items-center flex-col">
          <div class="h-full w-full max-w-[600px] mt-10 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] border-4 border-white/80 relative bg-[url('/public/bg-blur.jpg')] bg-no-repeat bg-cover overflow-hidden">
            <div class="text-2xl font-bold leading-[31.25px] text-center text-white">
              Buzzed Lightbeer Drink Orders
            </div>
            <ul
              id="order-list"
              class="list-none p-0 overflow-scroll h-full"
              hx-get="/orders"
              hx-swap="innerHTML"
              hx-target="#order-list"
              hx-trigger="load"
            ></ul>
          </div>
        </div>
      </body>
    </html>
  );
};
