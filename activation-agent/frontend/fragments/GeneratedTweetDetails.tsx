type GeneratedTweetDetailsProps = {
  thread_id?: string
  generated_tweet?: string
  handle?: string
  email?: string
}

export const GeneratedTweetDetails = ({
  thread_id,
  generated_tweet,
}: GeneratedTweetDetailsProps) => (
  <div style='text-align: center'>
    <h3 style='margin-bottom: 20px; color: #EF6F1C; text-align: center'>
      Share this post and get paid 1 USDC
    </h3>
    <form
      hx-post={thread_id ? `/thread/${thread_id}/pick` : '/thread'}
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
    >
      <div id='twitter-container' class='spacer twitter-preview'>
        <span class='hide-on-request' id='generated-tweet'>
          {generated_tweet}
        </span>
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
      </div>

      <a
        href={`/thread/${thread_id}/refresh`}
        style='text-decoration: none; color: #EF6F1C; font-weight: 500; margin-bottom: 40px; font-size: 18px'
        hx-post={`/thread/${thread_id}/refresh`}
        hx-trigger='click'
        hx-target='#generated-tweet'
        hx-swap='innerHTML'
        hx-indicator='#twitter-container'
      >
        <img
          src='/public/rotate-right.svg'
          style='vertical-align: middle; margin-right: 5px'
        />
        Regenerate
      </a>
      <button type='submit' hx-indicator='#spinner' class='submit-button'>
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
        Pick
      </button>
    </form>
  </div>
)
