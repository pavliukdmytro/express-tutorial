const faker = require('faker');
const models = require('./models');
const tr = require('transliter');

const owner = '5e47d1d8135dfee675bf703c';

module.exports = async () => {
    try{
        await models.Post.remove();

        for (const ignored of Array.from({length: 20})) {
            const title = faker.lorem.words(5);
            const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;
            const post = await models.Post.create({
                title,
                body: faker.lorem.words(100),
                owner,
                url
            })
            console.log(post);
        }
    } catch(err) {
        console.error(err);
    }
}


