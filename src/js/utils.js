// const Parser = require('rss-parser')
const axios = require('axios')

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
// const hacker_news_url = 'https://news.ycombinator.com/rss'
// const hnrss_url = 'https://hnrss.org/frontpage?count=50'
const hnrss_url_json = 'https://hnrss.org/frontpage.jsonfeed?count=50'

export const getTopItems = () => {
	return axios.get(PROXY_URL + hnrss_url_json)
		.then(response => {
			if (response.status === 200) {
				return extractDetails(response.data.items)
			} 
			throw new Error('Error ' + response.status)
		})
		.catch(error => {
			// handle error
			throw new Error(error)
		})
}

const extractDetails = (items) => {
	return items.map(item => {
		console.log(item.content_html);
	})
}

// const getFeedItems = async url => {
// 	const parser = new Parser()
// 	const feed = await parser.parseURL(PROXY_URL + url)
// 	return feed.items
// }

// export const getTopRssItems = () => getFeedItems(hacker_news_url)
