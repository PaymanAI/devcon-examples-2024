type PickedTweetMessageProps = { thread_id: string; pickedTweet: string }

export const PickedTweetMessage = ({
  thread_id,
  pickedTweet,
}: PickedTweetMessageProps) => (
  <div style='text-align: center'>
    <h3 style='margin-bottom: 20px; color: #EF6F1C; text-align: center'>
      Great Pick!
    </h3>
    <p>
      <div
        id='generated-tweet'
        class='spacer twitter-preview'
        onclick='copyToClipboard("generated-tweet")'
      >
        {pickedTweet}
        <span id='tooltip' class='tooltip'>
          Copied!
        </span>
      </div>
    </p>
    <a
      class='twitter-share-button'
      href='https://twitter.com/intent/tweet'
      data-size='large'
      data-text={pickedTweet}
      data-related='PaymanAI'
      data-url='https://paymanai.com'
    >
      Share on X
    </a>
    <script
      async
      src='https://platform.twitter.com/widgets.js'
      charset='utf-8'
    />
    <p style='margin-top: 30px; margin-bottom: 25px'>
      Now please share this post on your X account and then submit the url of your post below.
    </p>
    <form
      hx-post={thread_id ? `/thread/${thread_id}/submit` : '/thread'}
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
    >
      <input
        id='tweetURL'
        name='tweetURL'
        required={true}
        type='url'
        class='spacer'
        placeholder='Enter your post url...'
      />
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
        <span class='hide-on-request'>Submit</span>
      </button>
    </form>
  </div>
)
