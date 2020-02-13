const faker = require('faker');
var TurndownService = require('turndown');



const models = require('./models');

const owner = '5e44fc541910a528186daf7a';

module.exports = () => {
    models.Post.remove().then(() => {
        Array.from({length: 20}).forEach( () => {
            var turndownService = new TurndownService();
            models.Post.create({
                title: faker.lorem.words(5),
                body: turndownService.turndown(faker.lorem.words(100)),
                owner
            })
        })
    }).catch(console.error);
}


