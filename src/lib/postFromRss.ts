import Parser from 'rss-parser';
import { TwitterPost } from './types.js';


const URL = "https://rss.app/feeds/7ehIlv5GRMMNqmQR.xml"

type CustomFeed = { foo: string };
type CustomItem = {
    bar: number,
    'media:content'?: {
        $: { url: string; medium: string; } | undefined; url: string; medium: string
    };
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
    customFields: {
        feed: ['foo'],
        item: ['bar', 'media:content']
    }
});



export async function getTwitterPosts() {
    try {

        const feed = await parser.parseURL(URL);
        //console.log(feed.title); // feed will have a `foo` property, type as a string

        let twitterPosts: TwitterPost[] = [];

        if (feed.items.length > 1) {

            feed.items.forEach(item => {

                if (item.pubDate && item.title) {

                    let post: TwitterPost = {
                        pubDate: item.pubDate, // Acessa pubDate corretamente
                        title: item.title, // Acessa title corretamente
                    };

                    let mediaContent = item['media:content'];
                    if (mediaContent && mediaContent.$ && mediaContent.$.url) {
                        post.image = mediaContent.$.url;
                        //console.log('Image URL:', mediaContent.$.url); // Exibe a URL da imagem
                    }

                    twitterPosts.push(post);
                }
            });

            return twitterPosts;

        } else {
            throw new Error('Não foi encontrado nenhum post no Twitter/X.');
        }

    } catch (error) {
        throw new Error('Erro ao buscar posts originais no Twitter/X');
    }
}

/*
async function fetchTwitterFeed() {
    const feed = await parser.parseURL(URL);
    let output = [];
    for (const item of feed.items) {
        output.push({
            title: item.title,
            link: item.link,
        });
    }
    return output;
}

async function postBlueet() {

}

async function fetchLatestBlueets() {
    let cursor = "";

}
    */