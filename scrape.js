const scrape = require('website-scraper');

const options = {
    urls: ['https://www.charnphivnil.com/'],
    directory: './cloned-site',
    recursive: true,
    maxDepth: 1, // To avoid crawling outward too much
    sources: [
        {selector: 'img', attr: 'src'},
        {selector: 'link[rel="stylesheet"]', attr: 'href'},
        {selector: 'script', attr: 'src'},
        {selector: 'link[rel="icon"]', attr: 'href'},
        {selector: 'link[rel="apple-touch-icon"]', attr: 'href'}
    ]
};

scrape(options).then((result) => {
    console.log("Website successfully cloned into the 'cloned-site' directory.");
}).catch((err) => {
    console.error("An error occurred", err);
});
