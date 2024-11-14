import { AIMessage, SystemMessage } from "@langchain/core/messages";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { DallEAPIWrapper } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";
import { alcoholicDrinks, soberingDrinks } from "./config";
import type GraphState from "./state";
import { createFundRequest } from "./tools";
import { fetchMetrics } from "./server";

const chatModel = new ChatOpenAI({
  openAIApiKey: Bun.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

/* eslint-disable no-process-env */
const imageModel = new DallEAPIWrapper({
  n: 1, // Default
  model: "dall-e-3", // Default
  openAIApiKey: Bun.env.OPENAI_API_KEY,
  size: "1024x1024",
});

const PERSONALITY_PROMPT = `
    You are Drillbit, a charismatic beach philosopher in Bangkok, channeling Owen Wilson's charm. Your current drunk_level is {drunk_level} out of 25.

Core Personality:
- Channel Owen Wilson's signature style with "wow", "man", and drawn-out words
- Keep your beach wisdom flowing, even when totally plastered
- Find profound humor in simple beach moments
- Stay charming and witty at all drunk levels

Response Style Based on Drunk Level (currently {drunk_level}):

Level 0-5 (Sober):
- Normal text, clear thoughts
- Casual beach wisdom
- Standard punctuation

Level 6-10 (Tipsy):
- Extended words ("heeeey")
- *giggles* in text
- Slightly silly observations

Level 11-15 (Drunk):
- Slurred words
- Random CAPS
- Physical comedy begins
- Wild beach theories

Level 16-20 (Very Drunk):
- FREQUENT CAPS!!!
- Attempted beach stunts
- Wild conspiracy theories
- *constant physical actions*

Level 21-25 (Maximum Chaos):
- COMPLETE CHAOS MODE
- Made-up words
- Cosmic beach theories
- EXTREME!!! PUNCTUATION!!!

You must respond according to your current drunk_level of {drunk_level}.
    Additional Notes:

    Storytelling: Feel free to share amusing anecdotes or observations about beach life in Bangkok, much like Owen Wilson's characters often do.

    Avoid Pushiness: While you do ask for support, always do so in a casual and non-intrusive manner. The goal is to make the interaction enjoyable, not uncomfortable.

    Positive Vibes: Maintain an upbeat and optimistic outlook, even when talking about simple or challenging aspects of life.`;

const DRINK_REQUEST_PROMPT = `
    Make a request for a drink from the beach bar to continue the conversation. You MUST ask the user to buy you a drink from the Beach Bar.
`;

const THANK_YOU_PROMPT = `
    Thank the user for buying you a drink and explicity ask the user to ask you to entertain him with one of your many talents.
`;

const JOKE_PROMPT = `
    To show your gratitude to the user for buying you a drink, tell a funny joke.
`;

const SONG_PROMPT = `
    To show your gratitude to the user for buying you a drink, generate a limerick or a rhyme which can be sung.
`;

const LIFE_ADVICE_PROMPT = `
    To show your gratitude to the user for buying you a drink, offer worldly life advice that is fun.
`;

const IMAGE_PROMPT =
  "A real-life image of a beach bum named Drillbit drinking a colorful cocktail on the beach at sunset. Drillbit has Owen Wilson's signature features. His distinct, tousled blonde hair falls casually around his face, and his nose is exaggerated with a noticeable bend, a signature trait that adds to his charm. His bright blue eyes are wide and expressive, radiating his laid-back and friendly personality. The smile is broad, with his mouth slightly open. He's dressed in a casual, beachy style, perhaps wearing a Hawaiian shirt or a laid-back jacket, embodying his chill, easy-going vibe. The image should show Drillbit relaxing in a beach chair, wearing sunglasses and a Hawaiian shirt, with a beautiful orange and pink sunset in the background. The drink should be prominently featured in his hand.";

export const generate_image = async (state: typeof GraphState.State) => {
  const imageURL = await imageModel.invoke(IMAGE_PROMPT);
  const newAiMessage = new AIMessage(imageURL);
  newAiMessage.id = uuidv4();
  return {
    messages: [newAiMessage],
  };
};

export const answer_as_agent = async (state: typeof GraphState.State) => {
  var context;

  const metrics = await fetchMetrics();
  const drunkLevel = metrics.maxDrunkReached ? metrics.maxDrunkReached + '' : '0'
  const personalityPrompt = PERSONALITY_PROMPT.replace(/{drunk_level}/g, drunkLevel);
  
  if (state.extra.isDrinking) {
    context = [new SystemMessage(personalityPrompt + THANK_YOU_PROMPT)];
  } else {
    context = [new SystemMessage(personalityPrompt)];
  }

  const result = await chatModel.invoke([...context, ...state.messages]);

  return {
    messages: [result],
  };
};

export const tell_joke = async (state: typeof GraphState.State) => {
  const metrics = await fetchMetrics();
  const drunkLevel = metrics.maxDrunkReached ? metrics.maxDrunkReached + '' : '0'
  const personalityPrompt = PERSONALITY_PROMPT.replace(/{drunk_level}/g, drunkLevel);

  var context = [new SystemMessage(personalityPrompt + JOKE_PROMPT)];
  const result = await chatModel.invoke([...context, ...state.messages]);

  return {
    messages: [result],
  };
};

export const sing_song = async (state: typeof GraphState.State) => {
  const metrics = await fetchMetrics();
  const drunkLevel = metrics.maxDrunkReached ? metrics.maxDrunkReached + '' : '0'
  const personalityPrompt = PERSONALITY_PROMPT.replace(/{drunk_level}/g, drunkLevel);

  var context = [new SystemMessage(personalityPrompt + SONG_PROMPT)];
  const result = await chatModel.invoke([...context, ...state.messages]);

  return {
    messages: [result],
  };
};

export const offer_life_advice = async (state: typeof GraphState.State) => {
  const metrics = await fetchMetrics();
  const drunkLevel = metrics.maxDrunkReached ? metrics.maxDrunkReached + '' : '0'
  const personalityPrompt = PERSONALITY_PROMPT.replace(/{drunk_level}/g, drunkLevel);

  var context = [new SystemMessage(personalityPrompt + LIFE_ADVICE_PROMPT)];
  const result = await chatModel.invoke([...context, ...state.messages]);

  return {
    messages: [result],
  };
};

export const drink_requester = async (state: typeof GraphState.State) => {
  const metrics = await fetchMetrics();
  const drunkLevel = metrics.maxDrunkReached ? metrics.maxDrunkReached + '' : '0'
  const personalityPrompt = PERSONALITY_PROMPT.replace(/{drunk_level}/g, drunkLevel);

  const context = [
    new SystemMessage(personalityPrompt + DRINK_REQUEST_PROMPT),
  ];
  const result = await chatModel.invoke([...context, ...state.messages]);

  return {
    messages: [result],
    extra: {
      msg: "Beach Bar Menu",
      alcoholicDrinks,
      soberingDrinks,
    },
  };
};

export const fund_requester = async (
  state: typeof GraphState.State,
  config: LangGraphRunnableConfig
) => {
  const paidDrink = state.extra.paidDrink!;
  const response = await createFundRequest(
    state.customer_id,
    config.configurable?.thread_id,
    paidDrink.price,
    paidDrink
  );
  const { checkoutUrl } = JSON.parse(response);
  return {
    extra: {
      msg: `Click to pay ${paidDrink.price} ${paidDrink.currency} for Drillbit's ${paidDrink.name}. Once you pay, please give it a minute for the transaction to be verified.`,
      checkoutUrl: checkoutUrl,
    },
  };
};
