type GatherFeedbackProps = {
  thread_id?: string;
  user_request?: string;
  feedback?: string;
  email?: string;
};

export const GatherFeedback = ({
  thread_id,
  user_request,
  feedback,
  email,
}: GatherFeedbackProps) => (
  <div class="flex flex-col">
    <h1 class="text-3xl font-bold text-slate-800 mb-8">
      Provide feedback about DevCon 2024
    </h1>

    <form
      class="flex flex-col"
      hx-post={thread_id ? `/thread/${thread_id}` : "/thread"}
      hx-target="#result"
      hx-swap="innerHTML"
      hx-ext="json-enc"
    >
      {!!user_request?.length && (
        <div class="mb-5 text-red-600">{user_request}</div>
      )}

      <label for="email" class="text-lg mb-2.5 font-normal">
        Your Email:
      </label>
      <input
        id="email"
        name="email"
        required={true}
        type="email"
        value={email}
        class="px-3 py-3 text-base border border-gray-300 rounded-md mb-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Enter your email address..."
      />

      <label for="feedback" class="text-lg mb-2.5 font-normal">
        What do you think of the conference so far?
      </label>
      <textarea
        id="feedback"
        name="feedback"
        required={true}
        class="px-3 py-3 text-base border border-gray-300 rounded-md mb-10 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {feedback}
      </textarea>

      <button
        type="submit"
        hx-indicator="#spinner"
        class="px-3 py-3 text-base text-white bg-[#ef6f1c] rounded-md cursor-pointer hover:bg-[#ff7d61] transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <svg
          id="spinner"
          class="htmx-indicator w-4 h-4 opacity-0 transition-opacity duration-500"
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
        Submit Feedback
      </button>
    </form>
  </div>
);
