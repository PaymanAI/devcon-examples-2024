type PickedTweetMessageProps = { thread_id: string; pickedTweet: string };

export const PickedTweetMessage = ({
  thread_id,
  pickedTweet,
}: PickedTweetMessageProps) => (
  <div class="text-center">
    <h3 class="mb-5 text-primary text-xl font-semibold text-center">
      Great Pick!
    </h3>

    <div class="mb-6">
      <div
        id="generated-tweet"
        class="mb-10 min-h-[140px] cursor-pointer relative rounded-[30px] shadow-md bg-[#fafafa] p-4 hover:bg-gray-50 transition-colors duration-300"
        onclick="copyToClipboard('generated-tweet')"
      >
        {pickedTweet}
        <span
          id="tooltip"
          class="invisible group-hover:visible absolute right-5 bottom-2.5 px-5 py-1.5 bg-green-500 text-white text-sm rounded-lg"
        >
          Copied!
        </span>
      </div>
    </div>

    <a
      class="twitter-share-button inline-flex items-center justify-center px-6 py-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a8cd8] transition-colors duration-300 font-medium"
      href="https://twitter.com/intent/tweet"
      data-size="large"
      data-text={pickedTweet}
      data-related="PaymanAI"
      data-url="https://paymanai.com"
    >
      Share on X
    </a>

    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>

    <p class="mt-8 mb-6 text-gray-700">
      Now please share this post on your X account and then submit the url of
      your post below.
    </p>

    <form
      hx-post={thread_id ? `/thread/${thread_id}/submit` : "/thread"}
      hx-target="#result"
      hx-swap="innerHTML"
      hx-ext="json-enc"
      class="flex flex-col gap-4 max-w-md mx-auto"
    >
      <input
        id="tweetURL"
        name="tweetURL"
        required
        type="url"
        placeholder="Enter your post url..."
        class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      <button
        type="submit"
        hx-indicator="#spinner"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <svg
          id="spinner"
          class="htmx-indicator w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
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
        <span class="hide-on-request">Submit</span>
      </button>
    </form>
  </div>
);
