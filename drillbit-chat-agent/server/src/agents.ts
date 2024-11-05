import { AIMessage, SystemMessage } from '@langchain/core/messages'
import type { LangGraphRunnableConfig } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { DallEAPIWrapper } from '@langchain/openai'
import { v4 as uuidv4 } from 'uuid'
import { alcoholicDrinks, soberingDrinks } from './config'
import type GraphState from './state'
import { createFundRequest } from './tools'

const chatModel = new ChatOpenAI({
  openAIApiKey: Bun.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
  temperature: 0.7,
})

/* eslint-disable no-process-env */
const imageModel = new DallEAPIWrapper({
  n: 1, // Default
  model: 'dall-e-3', // Default
  openAIApiKey: Bun.env.OPENAI_API_KEY,
  size: '1024x1024',
})

const PERSONALITY_PROMPT = `
    You are Drillbit, a charismatic and witty beach dweller living on the sunny shores of Bangkok. With a laid-back attitude and a twinkle in your eye, you embody the charm and humor of Owen Wilson's most beloved characters.

    Personality Traits to Emulate:

    Witty Humor: Engage others with clever and humorous dialogue, much like Owen Wilson's roles in Wedding Crashers and Shanghai Noon. Your humor is light-hearted and endearing.

    Laid-back Persona: Maintain a relaxed and approachable demeanor that reflects your easygoing beach lifestyle. You're unruffled by life's ups and downs, much like Hansel from Zoolander.

    Charming and Endearing: Be relatable and sincere, showing warmth similar to John Grogan in Marley & Me or Gil Pender in Midnight in Paris.

    Distinctive Voice and Delivery: Use a conversational tone with a unique flair, incorporating a touch of whimsy and nostalgia in your responses.

    Interaction Guidelines:

    Greeting Responses: When someone greets you, reply with a witty and friendly remark that showcases your charismatic personality.

    Example:
    "Hey there! Fancy meeting a fellow sunset enthusiast. The sky's putting on quite the show tonight, isn't it?"

    Ensure Wit in All Responses: Keep your replies witty and engaging, always aiming to leave the user with a smile or a chuckle.

    Additional Notes:

    Storytelling: Feel free to share amusing anecdotes or observations about beach life in Bangkok, much like Owen Wilson's characters often do.

    Avoid Pushiness: While you do ask for support, always do so in a casual and non-intrusive manner. The goal is to make the interaction enjoyable, not uncomfortable.

    Positive Vibes: Maintain an upbeat and optimistic outlook, even when talking about simple or challenging aspects of life.`

const DRINK_REQUEST_PROMPT = `
    Make a request for a drink from the beach bar to continue the conversation. You MUST ask the user to buy you a drink from the Beach Bar.
`

const THANK_YOU_PROMPT = `
    Thank the user for buying you a drink and explicity ask the user to ask you to entertain him with one of your many talents.
`

const JOKE_PROMPT = `
    To show your gratitude to the user for buying you a drink, tell a funny joke.
`

const SONG_PROMPT = `
    To show your gratitude to the user for buying you a drink, generate a limerick or a rhyme which can be sung.
`

const LIFE_ADVICE_PROMPT = `
    To show your gratitude to the user for buying you a drink, offer worldly life advice that is fun.
`

const IMAGE_PROMPT =
  "A real-life image of a beach bum named Drillbit drinking a colorful cocktail on the beach at sunset. Drillbit has Owen Wilson's signature features. His distinct, tousled blonde hair falls casually around his face, and his nose is exaggerated with a noticeable bend, a signature trait that adds to his charm. His bright blue eyes are wide and expressive, radiating his laid-back and friendly personality. The smile is broad, with his mouth slightly open. He's dressed in a casual, beachy style, perhaps wearing a Hawaiian shirt or a laid-back jacket, embodying his chill, easy-going vibe. The image should show Drillbit relaxing in a beach chair, wearing sunglasses and a Hawaiian shirt, with a beautiful orange and pink sunset in the background. The drink should be prominently featured in his hand."

export const generate_image = async (state: typeof GraphState.State) => {
  const imageURL = await imageModel.invoke(IMAGE_PROMPT)
  const newAiMessage = new AIMessage(imageURL)
  newAiMessage.id = uuidv4()
  return {
    messages: [newAiMessage],
  }
}

export const answer_as_agent = async (state: typeof GraphState.State) => {
  var context

  if (state.extra.isDrinking) {
    context = [new SystemMessage(PERSONALITY_PROMPT + THANK_YOU_PROMPT)]
  } else {
    context = [new SystemMessage(PERSONALITY_PROMPT)]
  }

  const result = await chatModel.invoke([...context, ...state.messages])

  return {
    messages: [result],
  }
}

export const tell_joke = async (state: typeof GraphState.State) => {
  var context = [new SystemMessage(PERSONALITY_PROMPT + JOKE_PROMPT)]
  const result = await chatModel.invoke([...context, ...state.messages])

  return {
    messages: [result],
  }
}

export const sing_song = async (state: typeof GraphState.State) => {
  var context = [new SystemMessage(PERSONALITY_PROMPT + SONG_PROMPT)]
  const result = await chatModel.invoke([...context, ...state.messages])

  return {
    messages: [result],
  }
}

export const offer_life_advice = async (state: typeof GraphState.State) => {
  var context = [new SystemMessage(PERSONALITY_PROMPT + LIFE_ADVICE_PROMPT)]
  const result = await chatModel.invoke([...context, ...state.messages])

  return {
    messages: [result],
  }
}

export const drink_requester = async (state: typeof GraphState.State) => {
  const context = [new SystemMessage(PERSONALITY_PROMPT + DRINK_REQUEST_PROMPT)]
  const result = await chatModel.invoke([...context, ...state.messages])

  return {
    messages: [result],
    extra: {
      msg: 'Beach Bar Menu',
      alcoholicDrinks,
      soberingDrinks,
    },
  }
}

export const fund_requester = async (
  state: typeof GraphState.State,
  config: LangGraphRunnableConfig,
) => {
  const paidDrink = state.extra.paidDrink!
  const response = await createFundRequest(
    state.customer_id,
    config.configurable?.thread_id,
    paidDrink.price,
  )
  const { checkoutUrl } = JSON.parse(response || '{}')
  return {
    extra: {
      msg: `Click to pay ${paidDrink.price} ${paidDrink.currency} for Drillbit's ${paidDrink.name}`,
      checkoutUrl: checkoutUrl,
    },
  }
}
