const hnrss_url_json = 'https://hnrss.org/frontpage.jsonfeed?count=50'
const user_url_prefix = 'https://news.ycombinator.com/user?id='

const background_color = 'white'
const small_text_color = '#787878'
const dark_background_color = '#333333'
const dark_text_color = '#E8EDDF'
const dark_small_text_color = '#aeaeae'
const dark_border_color = '#787878'

const getItems = () => {
	return $.ajax({
		url: config.proxy + hnrss_url_json,
		type: 'GET',
		error: error => {
			throw new Error(error.responseText)
		},
		success: (data, status) => {
			if (status == 'success') {
				return data
			}
		},
	})
}

const createList = items => {
	return items.map((item, index) => {
		index += 1
		const comments_content = item.content_html.split('<p>Comments URL: <a href="')[1].split('">')
		const points_content = comments_content[1].split('<p>Points: ')[1].split('</p>')

		const comments_url = comments_content[0]
		const comments_count = +points_content[1].replace('<p># Comments: ', '')
		const points_count = +points_content[0]
		const user_url = user_url_prefix + item.author

		const points_string = points_count > 1 ? `${points_count} points | ` : `${points_count} point | `
		const comments_string = comments_count !== 1 ? `${comments_count} comments | ` : `${comments_count} comment | `

		$('ul').append(
			$('<li>').append([
				$('<div>')
					.attr('class', 'square')
					.append(index),
				$('<div>')
					.attr('class', 'section')
					.append([
						$('<a target="_blank">')
							.attr('href', item.url)
							.append(
								$('<span>')
									.attr('class', 'title')
									.append(item.title)
							),
						$('<div>')
							.attr('class', 'item-footer')
							.append([
								$('<span>')
									.attr('class', 'small-text')
									.append(points_string),
								$('<a target="_blank">')
									.attr('href', comments_url)
									.append(
										$('<span>')
											.attr('class', 'small-text')
											.append(comments_string)
									),
								$('<span>')
									.attr('class', 'small-text')
									.append(`by `),
								$('<a target="_blank">')
									.attr('href', user_url)
									.attr('class', 'small-text')
									.append(`${item.author}`),
							]),
					]),
			])
		)
	})
}

const setDarkMode = () => {
	chrome.storage.local.set({ dark_mode: true })
	$('body').css('background-color', dark_background_color)
	$('a').css('color', dark_text_color)
	$('li').css('border-color', dark_border_color)
	$('.small-text').css('color', dark_small_text_color)
	$('#moon').hide()
	$('#sun').show()
}
const setLightMode = () => {
	chrome.storage.local.set({ dark_mode: false })
	$('body').css('background-color', background_color)
	$('a').css('color', dark_background_color)
	$('li').css('border-color', dark_text_color)
	$('.small-text').css('color', small_text_color)
	$('#moon').show()
	$('#sun').hide()
}

$(document).ready(async () => {
	$('#show_button').hide()
	$('ul').hide()
	$('.loader').show()

	const now = Date.now()
	let items = []
	let dark_mode = false

	await new Promise(resolve => {
		chrome.storage.local.get(['front', 'dark_mode'], async res => {
			dark_mode = res.dark_mode

			if (res.front && res.front.expires > now) {
				items = res.front.items
				resolve()
			} else {
				const data = await getItems()
				items = data.items
				const expires = new Date(now + 1000 * 60 * 5).getTime() // expires in 5 minutes

				chrome.storage.local.set({
					front: {
						items,
						expires,
					},
				})
				resolve()
			}
		})
	})

	createList(items)

	if (dark_mode) {
		setDarkMode()
	} else {
		setLightMode()
	}

	$('.loader').hide()
	$('ul li:gt(24)').hide()
	$('ul').show()
	$('#show_button').show()

	$('#show_button').click(function() {
		$('#show_button').hide()
		$('ul li:gt(24)').show()
	})
	$('#moon').click(() => setDarkMode())
	$('#sun').click(() => setLightMode())
})
