import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";
import { getTwitterPosts } from "./lib/postFromRss.js";

//const text = await Bot.runPost(getPostText, { dryRun: true });
//console.log(`[${new Date().toISOString()}] Posted: "${text}"`);


//console.log(getTwitterPosts());
getTwitterPosts().then((posts) => {


    const twtOrigPosts = posts.slice(0, 10).reverse();

    console.log("Twitter: ")
    console.log(twtOrigPosts)

    Bot.runGet().then(async (botBlueets) => {
        console.log("Bluesky: ")
        console.log(botBlueets);

        const botTexts = botBlueets.reverse().map((post: { text: any; }) => post.text);

        // Filtra os posts originais que ainda não foram postados no bot
        let postsToPublish = twtOrigPosts.filter(post => !botTexts.includes(post.title));
        //postsToPublish = postsToPublish.reverse();

        console.log("------ posts to publish: -------")
        console.log(postsToPublish);

        // Posta no Bluesky:

        await Bot.runPost(postsToPublish, { dryRun: true });

        /*
        postsToPublish.forEach(async (post) => {
            await Bot.runPost(post.title, { dryRun: true });
        });
        */

    });

})

