"use strict"
const url = 'http://students.a-level.com.ua:10012'
let savedNextId = 0

// savedNextId - следующий айди, который я буду запрашивать
// nextMessageId - ответ сервера, который я сохраняю
// messageId - поле в запросе на сервер
// nextId - внутренний параметр в getMessages (фактически равен savedNextId)

document.body.onload = () => {
    getMessages(savedNextId)
    setInterval(() => getMessages(savedNextId), 1000)
}

send.onclick = async event => {
    event.preventDefault()
    addMessage()
}

async function jsonPost(url, data) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
    })
    
    if (!response.ok) {
        throw new Error('Response is not ok')
    }

    return response.json() 
}

async function addMessage() {
    try {
        await jsonPost(url, {
            func: "addMessage",
            nick: nick.value,
            message: msg.value
        })

        getMessages(savedNextId)

        msg.focus()
        msg.value = ''
        
    } catch (err) {
        console.warn(err)
    }
}

async function getMessages(nextId) {
    try {
        // Запрос на сервер
        const response = await jsonPost(url, {
            func: "getMessages",
            messageId: nextId
        })

        // Если на сервере нет новых сообщений - сразу выход
        if (response.nextMessageId <= nextId) {
            return
        }

        const data = response.data

        // Отрисовка всех новых сообщений
        for (let i = 0; i < data.length; i++) {
            const timestamp = new Date(data[i].timestamp)
            const time = document.createElement('span')
            time.textContent = timestamp.toLocaleTimeString()
            time.classList += ' timestamp'

            const nick = document.createElement('span')
            nick.textContent = data[i].nick
            nick.classList += ' nick'

            const msg = document.createElement('span')
            msg.textContent = data[i].message
            msg.classList += ' message'

            const div = document.createElement('div')
            div.append("[", time, "] ", nick, ": ", msg)
            div.classList += ' msg-container'

            board.append(div)

            nextId = response.nextMessageId
        }
        
        window.scroll(0, document.body.scrollHeight)
        
    } catch (err) {
        console.warn(err)
    }
}