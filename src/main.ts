import '@/style/tailwind.css'
import { throwIfNull } from '@/_utility'
// @ts-expect-error we dont have types for this
import { VoiceRSS } from '@/js/voicerss-tts.min.js'
import { JokeApi } from '@/js/_api.ts'

/**
 * Represents references to DOM elements used in the application.
 */
type DomReferences = Readonly<{
  /** Reference to the main application container element. */
  app: HTMLElement
  /** Reference to the audio element used for text-to-speech. */
  audioElement: HTMLAudioElement
  /** Reference to the button element used to trigger text-to-speech. */
  button: HTMLButtonElement
  /** Reference to the joke element. */
  joke: HTMLElement
}>

/**
 * Configuration parameters for the application.
 */
type Parameters = Readonly<{
  /** API key for VoiceRSS. */
  VOICE_RSS_API_KEY: string
}>

class App {
  public readonly domRefs: DomReferences
  private voiceRssApi: unknown
  private readonly VOICE_RSS_API_KEY: string
  private readonly jokeApi: JokeApi

  /**
   * Creates a new instance of the application.
   * @param VOICE_RSS_API_KEY - API key for VoiceRSS
   */
  constructor({ VOICE_RSS_API_KEY }: Parameters) {
    this.domRefs = this.initDomRefs()
    this.voiceRssApi = VoiceRSS
    this.VOICE_RSS_API_KEY = VOICE_RSS_API_KEY
    this.jokeApi = new JokeApi()

    this.initialize()
  }

  /**
   * Initializes the DOM references for the application.
   * @throws Error - will throw an error if any of the DOM elements are not found.
   * @returns An object containing references to DOM elements.
   */
  private initDomRefs(): DomReferences {
    const app = throwIfNull(document.querySelector<HTMLElement>('#app'), 'App element not found')
    const audioElement = throwIfNull(document.querySelector<HTMLAudioElement>('#audio'), 'Audio element not found')
    const button = throwIfNull(document.querySelector<HTMLButtonElement>('#button'), 'Button element not found')
    const joke = throwIfNull(document.querySelector<HTMLElement>('#joke'), 'Joke element not found')

    return Object.freeze({
      app,
      audioElement,
      button,
      joke,
    })
  }

  private initialize(): void {
    this.bindEvents()
  }

  private bindEvents(): void {
    this.domRefs.button.addEventListener('click', () => {
      this.handleClick().catch((error: unknown) => {
        console.error(error)
        // this.domRefs.button.disabled = false
        this.domRefs.joke.textContent = 'Something went wrong. Please try again later.'
        this.domRefs.joke.classList.remove('hidden')
        this.domRefs.joke.classList.add('opacity-100')
      })
    })
  }

  private async handleClick(): Promise<void> {
    this.domRefs.button.disabled = true
    const joke = await this.jokeApi.getJoke()
    const jokeText = joke.type === 'single' ? joke.joke : `${joke.setup} ... ${joke.delivery}`

    this.domRefs.joke.innerText = jokeText.replaceAll('...', '\n')

    // Show joke with fade-in animation
    this.domRefs.joke.classList.remove('hidden')
    void this.domRefs.joke.offsetHeight // Force a reflow
    this.domRefs.joke.classList.add('opacity-100')

    // Start text-to-speech
    this.textToSpeech(this.domRefs.audioElement, jokeText)

    const handleFadeOut = (): void => {
      this.domRefs.joke.classList.remove('opacity-100')
      this.domRefs.joke.addEventListener(
        'transitionend',
        () => {
          this.domRefs.joke.classList.add('hidden')
          this.domRefs.button.disabled = false
        },
        { once: true },
      )
    }

    // Set fallback timer (in case audio fails)
    const timeoutId = setTimeout(handleFadeOut, 5000)

    // Clear fallback timer when audio is ready
    this.domRefs.audioElement.addEventListener(
      'canplay',
      () => {
        clearTimeout(timeoutId)
      },
      { once: true },
    )

    // Hide joke when audio finishes
    this.domRefs.audioElement.addEventListener('ended', handleFadeOut, { once: true })
  }

  private textToSpeech(audio: HTMLAudioElement, text: string): void {
    // @ts-expect-error we dont have types for this
    // eslint-disable-next-line
    this.voiceRssApi.speech(
      {
        key: this.VOICE_RSS_API_KEY,
        src: text,
        hl: 'en-us',
        v: 'Linda',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
      },
      audio,
    )
  }
}

new App({
  VOICE_RSS_API_KEY: String(import.meta.env.VITE_VOICE_RSS_API_KEY), //4444fd21245a4e5898fbc97cc815cb0b
})
