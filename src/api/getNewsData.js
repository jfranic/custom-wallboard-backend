const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {
        // Generate a random number of news items (between 2 and 8)
        const numberOfNewsItems = Math.floor(Math.random() * (8 - 2 + 1)) + 2;

        // Create an array to store the random news data
        const news = [];

        // Generate random news items and push them into the 'news' array
        for (let i = 1; i <= numberOfNewsItems; i++) {
            const newsItem = {
                title: `title ${i}`,
                description: `description ${i}`
            };
            news.push(newsItem);
        }

        // Return the response with a 200 status code
        return generateResponse.handler(200, {
            successMessage: 'News retrieved successfully',
            news: news
        });
    } catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error';
        // Return an error response with a 500 status code
        return generateResponse.handler(500, {
            errorMessage: errorMessage
        });
    }
};
