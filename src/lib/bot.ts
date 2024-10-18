import { bskyAccount, bskyService } from "./config.js";
import type {
  AtpAgentLoginOpts,
  AtpAgentOpts,
  AppBskyFeedPost,
} from "@atproto/api";
import atproto from "@atproto/api";
import { TwitterPost } from "./types.js";
const { BskyAgent, RichText } = atproto;

type BotOptions = {
  service: string | URL;
  dryRun: boolean;
};

export default class Bot {
  #agent;

  static defaultOptions: BotOptions = {
    service: bskyService,
    dryRun: false,
  } as const;

  constructor(service: AtpAgentOpts["service"]) {
    this.#agent = new BskyAgent({ service });
    //this.#agent =  new atproto.BskyAgent({ service });
  }

  login(loginOpts: AtpAgentLoginOpts) {
    return this.#agent.login(loginOpts);
  }

  async post(
    text:
      | string
      | (Partial<AppBskyFeedPost.Record> &
        Omit<AppBskyFeedPost.Record, "createdAt">)
  ) {
    if (typeof text === "string") {
      const richText = new RichText({ text });
      await richText.detectFacets(this.#agent);
      const record = {
        text: richText.text,
        facets: richText.facets,
      };
      return this.#agent.post(record);
    } else {
      return this.#agent.post(text);
    }
  }

  async get(limit: number = 10) {
    try {
      const response = await this.#agent.api.app.bsky.feed.getAuthorFeed({
        actor: bskyAccount.identifier, // Handle da conta para obter o feed
        limit,
      });

      if (response.success) {

        const records = response.data.feed.map((item: any) => {
          const { text, createdAt } = item.post.record;
          return { text, createdAt };
        });

        return records;

      } else {
        throw new Error("Falha ao obter o feed do usuário");
      }
    } catch (error) {
      throw new Error('Erro no get dos blueets');
    }
  }

  /*
    static async runPost(
      getPostText: () => Promise<string>,
      botOptions?: Partial<BotOptions>
    ) {
      console.log("Running post ");
      const { service, dryRun } = botOptions
        ? Object.assign({}, this.defaultOptions, botOptions)
        : this.defaultOptions;
      const bot = new Bot(service);
      await bot.login(bskyAccount);
      const text = await getPostText();
      if (!dryRun) {
        await bot.post(text);
      }
      return text;
    }
      */

  /*
  static async runPost(
    postText: string,
    botOptions?: Partial<BotOptions>
  ) {
    console.log("Posting... " + postText);
  
    const { service, dryRun } = botOptions
      ? Object.assign({}, this.defaultOptions, botOptions)
      : this.defaultOptions;
  
    const bot = new Bot(service);
    await bot.login(bskyAccount);
  
    if (!dryRun) {
      await bot.post(postText);
    }
  
    console.log("Posted!");
    return postText;
  }
  */

  static async runPost(
    posts: TwitterPost[],
    botOptions?: Partial<BotOptions>
  ) {

    console.log("Starting to post array. Size: " + posts.length);

    posts.forEach(async post => {

      console.log("Posting... " + post.title);

      const { service, dryRun } = botOptions
        ? Object.assign({}, this.defaultOptions, botOptions)
        : this.defaultOptions;

      const bot = new Bot(service);
      await bot.login(bskyAccount);

      if (!dryRun) {
        await bot.post(post.title);
      }

      console.log("Posted!");
    });

    console.log("Complete!");
  }


  static async runGet(
    botOptions?: Partial<BotOptions>
  ) {

    console.log("Running get ");

    const { service, dryRun } = botOptions
      ? Object.assign({}, this.defaultOptions, botOptions)
      : this.defaultOptions;

    const bot = new Bot(service);
    await bot.login(bskyAccount);

    if (!dryRun) {
      await bot.get();
    }
    return bot.get();
  }

}
