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
  <div class='text-center'>
    <h3 class='mb-5 text-center font-semibold text-primary text-xl md:text-2xl'>
      Share this post and get paid 1 USDC
    </h3>

    <form
      hx-post={thread_id ? `/thread/${thread_id}/pick` : '/thread'}
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
      class='flex flex-col items-center'
    >
      <div
        id='twitter-container'
        class='relative mb-10 min-h-[140px] w-full cursor-pointer rounded-[30px] bg-[#fafafa] p-4 text-center shadow-md'
      >
        <span class='hide-on-request md:text-xl' id='generated-tweet'>
          {generated_tweet}
        </span>

        <svg
          id='spinner'
          class='htmx-indicator h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <title>Loading</title>
          <path
            fill='#000000'
            d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
            opacity='0.25'
          />
          <circle cx='12' cy='2.5' r='1.5' fill='#000000'>
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
        class='mb-10 flex items-center font-medium text-lg no-underline transition-opacity duration-300 hover:opacity-80 md:text-2xl'
        hx-post={`/thread/${thread_id}/refresh`}
        hx-trigger='click'
        hx-target='#generated-tweet'
        hx-swap='innerHTML'
        hx-indicator='#twitter-container'
      >
        <img
          src='/public/rotate-right.svg'
          class='mr-1.5 h-5 w-5 align-middle'
          alt='Regenerate'
        />
        Regenerate
      </a>

      <button
        type='submit'
        hx-indicator='#spinner'
        class='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      >
        <span class='hide-on-request md:text-xl'>Pick</span>
      </button>
    </form>
  </div>
)
