const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
const hnrss_url_json = 'https://hnrss.org/frontpage.jsonfeed?count=50'

const getTopItems = () => {
	$.ajax({
    	url: PROXY_URL + hnrss_url_json,
    	type: 'GET',
    	success: (data, status) => {
      		if (status == "success") {
      			console.log(data);
      			const items = extractDetails(data.items)
      		}
    	}
  	})
}

const extractDetails = (items) => {
	return items.map(item => {
		const comments_url_index = item.content_html.indexOf('Comments URL:')
		// console.log(comments_url_index);
		// console.log(item.content_html[comments_url_index]);
		// $("ul").append(item.content_html);

		$('ul').append(
		    $('<li>').append([
		        $('<a target="_blank">').attr('href', item.url).append(
		            $('<span>').attr('class', 'tab').append(item.title)
	            ),
	            $('<div>').append(item.content_html),
	        ])
	    )

	})
}


$(document).ready(() => {
	getTopItems()
			
})