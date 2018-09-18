const hnrss_url_json = 'https://hnrss.org/frontpage.jsonfeed?count=50'
const user_url_prefix = 'https://news.ycombinator.com/user?id='

const getTopItems = () => {
	$.ajax({
    	url: config.proxy + hnrss_url_json,
    	type: 'GET',
        error: error => {
        	throw new Error(error.responseText)
        },
    	success: (data, status) => {
      		if (status == "success") {
      			const items = extractDetails(data.items)
      		}
    	}
  	})
}

const extractDetails = (items) => {
	return items.map((item, index) => {
		index += 1
		const comments_content = item.content_html.split('<p>Comments URL: <a href="')[1].split('">')
		const points_content = comments_content[1].split('<p>Points: ')[1].split('</p>')

		const comments_url = comments_content[0]
		const comments_count = +points_content[1].replace('<p># Comments: ', '')
		const points_count = +points_content[0]
		const user_url = user_url_prefix + item.author

		$('ul').append(
		    $('<li>').append([
	            $('<div>').attr('class', 'box').append(index),
	            $('<div>').attr('class', 'section').append([
	            	$('<a target="_blank">').attr('href', item.url).append(
			            $('<span>').attr('class', 'title').append(item.title)
		            ),
		            $('<div>').attr('class', 'item-footer').append([
			            $('<span>').attr('class', 'small-text').append(`${points_count} points | `),
			            $('<a target="_blank">').attr('href', comments_url).append(
				            $('<span>').attr('class', 'small-text').append(`${comments_count} comments | `)
			            ),
			            $('<span>').attr('class', 'small-text').append(`by `),
			            $('<a target="_blank">').attr('href', user_url).attr('class', 'small-text').append(`${item.author}`),
	            	])
	            ])
	        ])
	    )

	})
}


$(document).ready(() => {
	getTopItems()
			
})