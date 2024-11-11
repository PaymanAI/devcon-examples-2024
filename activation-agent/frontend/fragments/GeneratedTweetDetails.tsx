type GeneratedTweetDetailsProps = {
  thread_id?: string;
  generated_tweet?: string;
  handle?: string;
  email?: string;
};

export const GeneratedTweetDetails = ({
  thread_id,
  generated_tweet,
}: GeneratedTweetDetailsProps) => (
  <div class="text-center">
    <h3 class="mb-5 text-primary md:text-2xl text-xl font-semibold text-center">
      Share this post and get paid 1 USDC
    </h3>

    <form
      hx-post={thread_id ? `/thread/${thread_id}/pick` : "/thread"}
      hx-target="#result"
      hx-swap="innerHTML"
      hx-ext="json-enc"
      class="flex flex-col items-center"
    >
      <div
        id="twitter-container"
        class="mb-10 min-h-[140px] cursor-pointer relative rounded-[30px] shadow-md bg-[#fafafa] p-4 w-full text-center"
      >
        <span class="hide-on-request md:text-xl" id="generated-tweet">
          {generated_tweet}
        </span>

        <svg
          id="spinner"
          class="htmx-indicator w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <title>Loading</title>
          <path
            fill="#000000"
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25"
          />
          <circle cx="12" cy="2.5" r="1.5" fill="#000000">
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </circle>
        </svg>
      </div>

      <a
        href={`/thread/${thread_id}/refresh`}
        class="flex items-center font-medium mb-10 md:text-2xl text-lg no-underline hover:opacity-80 transition-opacity duration-300"
        hx-post={`/thread/${thread_id}/refresh`}
        hx-trigger="click"
        hx-target="#generated-tweet"
        hx-swap="innerHTML"
        hx-indicator="#twitter-container"
      >
        <img
          src="/public/rotate-right.svg"
          class="align-middle mr-1.5 w-5 h-5"
          alt="Regenerate"
        />
        Regenerate
      </a>

      <button
        type="submit"
        hx-indicator="#spinner"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="hide-on-request md:text-xl">Pick</span>
      </button>
    </form>
  </div>
);
