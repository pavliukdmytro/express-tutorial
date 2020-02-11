const faker = require('faker');
var TurndownService = require('turndown');



const models = require('./models');

const owner = '5e42f5e0105b82c2d766a7cc';

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


