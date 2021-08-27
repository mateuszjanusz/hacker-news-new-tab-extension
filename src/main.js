const user_url_prefix = 'https://news.ycombinator.com/user?id='
const post_url_prefix = 'https://news.ycombinator.com/item?id='

const background_color = 'white'
const small_text_color = '#787878'
const dark_background_color = '#333333'
const dark_text_color = '#E8EDDF'
const dark_small_text_color = '#aeaeae'
const dark_border_color = '#787878'

const getItem = (id) => {
    return $.ajax({
        url: `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
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

const getItems = () => {
    return $.ajax({
        url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
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

        const user_url = user_url_prefix + item.by
        const comments_url = post_url_prefix + item.id

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
                                    .append(` ${item.score} points | `),
                                $('<a target="_blank">')
                                    .attr('href', comments_url)
                                    .append(
                                        $('<span>')
                                            .attr('class', 'small-text')
                                            .append(`${item.descendants} comments`)
                                    ),
                                $('<span>')
                                    .attr('class', 'small-text')
                                    .append(` | by `),
                                $('<a target="_blank">')
                                    .attr('href', user_url)
                                    .attr('class', 'small-text')
                                    .append(`${item.by}`),
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

                await Promise.all(data.slice(0, 50).map(async (id) => {
                    const item = await getItem(id)
                    items.push(item)
                }));

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

    $('#show_button').click(() => {
        $('#show_button').hide()
        $('ul li:gt(24)').show()
    })
    $('#moon').click(() => setDarkMode())
    $('#sun').click(() => setLightMode())
})
