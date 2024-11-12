type PickedTweetMessageProps = { thread_id: string; pickedTweet: string }

export const PickedTweetMessage = ({
  thread_id,
  pickedTweet,
}: PickedTweetMessageProps) => (
  <div class='text-center'>
    <h3 class='mb-5 text-center font-semibold text-primary text-xl md:text-2xl'>
      Great Pick!
    </h3>

    <div class='mb-6'>
      <div
        id='generated-tweet'
        class='relative mb-10 min-h-[140px] cursor-pointer rounded-[30px] bg-[#fafafa] p-4 shadow-md transition-colors duration-300 hover:bg-gray-50 md:text-2xl'
        onclick="copyToClipboard('generated-tweet')"
      >
        {pickedTweet}
        <span
          id='tooltip'
          class='invisible absolute right-5 bottom-2.5 rounded-lg bg-green-500 px-5 py-1.5 text-sm text-white group-hover:visible'
        >
          Copied!
        </span>
      </div>
    </div>

    <div class='flex w-full justify-center text-center'>
      <a
        class='twitter-share-button inline-flex items-center justify-center rounded-full bg-[#1DA1F2] px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-[#1a8cd8] md:text-xl'
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          pickedTweet,
        )}&url=https://paymanai.com&via=PaymanAI`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Share on X
      </a>
    </div>

    <p class='mt-8 mb-6 text-gray-700 md:text-2xl'>
      Click on the Post button above to share on your X account and then submit
      the url of your post below.
    </p>

    <form
      hx-post={thread_id ? `/thread/${thread_id}/submit` : '/thread'}
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
      class='mx-auto flex max-w-md flex-col gap-4'
    >
      <input
        id='tweetURL'
        name='tweetURL'
        required={true}
        type='url'
        placeholder='Enter your post url...'
        class='mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary md:text-xl'
      />

      <button
        type='submit'
        hx-indicator='#spinner'
        class='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      >
        <span class='hide-on-request md:text-xl'>Submit</span>
      </button>
    </form>
  </div>
)
