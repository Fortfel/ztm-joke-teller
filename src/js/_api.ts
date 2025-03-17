type JokeApiCommonResponse = {
  error: boolean
  category: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
  id: number
  safe: boolean
  lang: string
}

type JokeApiSingleResponse = JokeApiCommonResponse & {
  type: 'single'
  joke: string
}

type JokeApiMultipleResponse = JokeApiCommonResponse & {
  type: 'twopart'
  setup: string
  delivery: string
}

type JokeApiResponse = JokeApiSingleResponse | JokeApiMultipleResponse

class JokeApi {
  private readonly API_URL =
    'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'

  public async getJoke(): Promise<JokeApiResponse> {
    try {
      const response = await fetch(this.API_URL)

      if (!response.ok) {
        throw new Error('Failed to fetch joke')
      }

      return await (response.json() as Promise<JokeApiResponse>)
    } catch (error) {
      console.error('Error fetching joke:', error)
      throw error
    }
  }
}

export { JokeApi }
export type { JokeApiResponse }
