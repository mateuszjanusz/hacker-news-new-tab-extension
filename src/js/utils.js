const Parser = require('rss-parser')
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'

export const getFeedItems = async url => {
	const parser = new Parser()
	const feed = await parser.parseURL(PROXY_URL + url)
	return feed.items
}

// hacker_news: {
//         url: 'https://news.ycombinator.com/rss',
//         title: 'Hacker News',
//         items: [],
//         map: item => {
//             return {
//                 title: item.title,
//                 content: item.content,
//                 author: item.author,
//                 ts: item.pubDate,
//                 url: item.link,
//             }
//         },
//     },