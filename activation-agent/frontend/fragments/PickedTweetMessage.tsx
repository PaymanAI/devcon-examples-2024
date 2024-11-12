type PickedTweetMessageProps = { thread_id: string; pickedTweet: string };

export const PickedTweetMessage = ({
  thread_id,
  pickedTweet,
}: PickedTweetMessageProps) => (
  <div class="text-center">
    <h3 class="mb-5 text-primary md:text-2xl text-xl font-semibold text-center">
      Great Pick!
    </h3>

    <div class="mb-6">
      <div
        id="generated-tweet"
        class="mb-10 min-h-[140px] cursor-pointer relative md:text-2xl rounded-[30px] shadow-md bg-[#fafafa] p-4 hover:bg-gray-50 transition-colors duration-300"
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

    <div class="text-center w-full flex justify-center">
      <a
        class="twitter-share-button inline-flex items-center md:text-xl justify-center px-6 py-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a8cd8] transition-colors duration-300 font-medium"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          pickedTweet
        )}&url=https://paymanai.com&via=PaymanAI`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on X
      </a>
    </div>

    <p class="mt-8 mb-6 text-gray-700 md:text-2xl">
      Click on the Post button above to share on your X account and then submit
      the url of your post below.
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
        class="w-full p-3 border border-gray-300 rounded-lg mb-4 md:text-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      <button
        type="submit"
        hx-indicator="#spinner"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="hide-on-request md:text-xl">Submit</span>
      </button>
    </form>
  </div>
);
