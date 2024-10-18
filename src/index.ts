import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";
import { getTwitterPosts } from "./lib/postFromRss.js";

//const text = await Bot.runPost(getPostText, { dryRun: true });
//console.log(`[${new Date().toISOString()}] Posted: "${text}"`);


//console.log(getTwitterPosts());
getTwitterPosts().then((posts) => {
    console.log(posts)

    const twtOrigPosts = posts;

    Bot.runGet().then((botBlueets) => {
        console.log(botBlueets)

    });

})

