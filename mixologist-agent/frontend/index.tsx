export const index = () => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <title>Buzz Lightbeer</title>
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
        <link rel='stylesheet' href='/public/style.css' />
        <script src='/public/lightbeer.js' />
      </head>

      <body>
        <div class='container'>
          <div class='logo'>
            <img src='/public/buzzed-logo.png' alt='Buzz Lightbeer' />
          </div>
          <div class='chat-container'>
            <div class='budget-info'>
              <span>
                Total Tips: USDC
                <span
                  id='budget'
                  hx-get='/tips'
                  hx-swap='innerHTML'
                  hx-trigger='every 5s'
                  hx-target='#budget'
                />
              </span>
              <span>
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
            <div id='result' class='chat-messages'>
              <form
                hx-post='/start'
                hx-target='#result'
                hx-swap='innerHtml'
                class='start-form'
              >
                <button type='submit' class='button' hx-indicator='#spinner'>
                  <svg
                    id='spinner'
                    class='htmx-indicator'
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
                  <div class='hide-on-request'>Chat with Buzzed Lightbeer</div>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class='powered'>
          <div style='font-weight: bold'>Powered by</div>
          <img
            src='/public/logo-transparent-white.png'
            alt='Payman Logo'
            style='width: 150px'
          />
          <img
            src='/public/coinbase-logo.svg'
            alt='coinbase Logo'
            style='width: 150px; margin-top: -5px'
          />
        </div>
      </body>
    </html>
  )
}
