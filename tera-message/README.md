<p align="center"><img src="https://github.com/war100ck/others/blob/master/terabooxlogo.svg"></p>

TERA-Message
======

# Особенности

Вывод цветного текста в чате

------

# Примеры:

const Message = require('../tera-message')

const MSG = new Message(mod)

var txt = "Hello"

# MSG.chat(txt)

- MSG.chat (MSG.BLU (txt) / / /8 Proxy channel blue text

- MSG.chat (MSG.YEL (txt) ) // /8 Proxy channel yellow text

- MSG.chat (MSG.TIP (txt) / / /8 Proxy channel Cyan Text

- MSG.chat (MSG.RED (txt) / / /8 Proxy channel red text

- MSG.chat (MSG.GRY (txt) / / /8 Proxy channel gray text

- MSG.chat (MSG.PIK (txt) / / /8 Proxy channel pink text

-- MSG.chat (MSG.clr (txt, 123456) / / /8 Proxy channel #123456 color text

# MSG.party (txt) / / (only own client visible) captain notice

# MSG.raids (txt) / / (only visible to their clients) head of notice

# MSG.alert (txt, type) / / (only visible to the client) screen warning

type: numeric arguments represent different styles

- Green. 31 32 37 41 42 50 52 54 55 56 57 58 59 60 61 62 80 100 colon 68, flag 75.

- Blue 43 colon 66 68 70 72 flag 76 bottle 101

- Red 44 53 67 69 71 73 flag 77 bottle 102

- LEVEL UP 35.
---
## Автор оригинального мода [ZC / Tera Message](https://github.com/tera-mod/tera-message).
## Author of the original modification [ZC / Tera Message](https://github.com/tera-mod/tera-message).
---
