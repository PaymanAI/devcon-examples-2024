export const bartender = () => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
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
        <link rel='stylesheet' href='/public/style.css' />
        <script src='/public/lightbeer.js' />
      </head>

      <body>
        <div class='container'>
          <div class='chat-container offset scroll'>
            <div class='title'>Buzzed Lightbeer Drink Orders</div>
            <ul
              id='order-list'
              class='order-list'
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
