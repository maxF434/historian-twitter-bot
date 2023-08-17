require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./client.js")

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const express = require("express");
const app = express();
app.use(express.json());

const {readFileSync, writeFileSync} = require('fs');


async function Fire(){
  const date = new Date();

  if(date.getMinutes() == 35){
    var topics = JSON.parse(readFileSync('./topics.json', { encoding: 'utf8' }));
    var wildcards = JSON.parse(readFileSync('./wildcards.json', { encoding: 'utf8' }));

    var chance = Math.random() * 100;

    if(chance >= 5){
      var prompt = "Tweet a short historical fact " + topics[Math.floor(Math.random()*topics.length)]
    } else {
      var prompt = wildcards[Math.floor(Math.random()*wildcards.length)]
    }

    console.log(prompt)

   const configuration = new Configuration({

      apiKey: "openai api key",

    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 64,
    });

    console.log(response.data.choices[0].text);

    const tweet = async () => {
      try {
        await twitterClient.v2.tweet(response.data.choices[Math.floor(Math.random()* response.data.choices.length)].text);
      } catch (e) {
        console.log(e)
      }
    }
    
    tweet();
  }


}


setInterval(Fire,  60000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}