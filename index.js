console.log('Bot starting');

require('dotenv').config();
const fetch = require('cross-fetch');
const Twit = require('twit');

const twitter = Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const runProgram = () => {

  fetch('https://random-word-form.herokuapp.com/random/adjective')
  .then(res => res.json())
  .then(jsonRes => {
    var word = jsonRes[0];
    var sentence = 'osu is ' + word;

    twitter.post('statuses/update', { status: sentence}, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sucess tweting: " + data.text);

        console.log("Sucess: name changed");

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
          .then(res => res.json())
          .then(jsonRes => {

            //console.log(jsonRes);

            if (jsonRes.title === "No Definitions Found") {
              console.log('No definitions found for: ' + word);

              twitter.post('statuses/update', { status: 'No definitions found for ' + word, in_reply_to_status_id: data.id_str }, (err, data, response) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Sucess tweeting - no definitions found");
                }
              });
            }

            var definition = jsonRes[0].meanings[0].definitions[0].definition;
            var phonetic = jsonRes[0].phonetic;
            var partOfSPeech = jsonRes[0].meanings[0].partOfSpeech;

            twitter.post('statuses/update', { status: word + '  (' + phonetic + ') - ' + partOfSPeech + '\nDefinition: ' + definition, in_reply_to_status_id: data.id_str }, (err, data, response) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Success tweeting defintion");
              }}
            )})
            .catch(err  => console.log(err));
          }
        })

        twitter.post('account/update_profile', { name: 'currently osu is - ' + word }, (err, data, response) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Sucess: name changed");
          }
        })

      })
      .catch(err => console.log(err))

}
