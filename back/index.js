/**
 * Импортируем настройки из лежащего в той же папке файла .env
 */
require("dotenv").config();

const { TELEGRAM_API_TOKEN, GAME_URL, GAME_NAME } = process.env;

/**
 * Подключаем библиотеки для работы с вебом, раздачи файлов и работы с Телеграм
 */
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

/**
 * Инициализируем телеграм-бота
 */
const bot = new TelegramBot(TELEGRAM_API_TOKEN, { polling: true });
const queries = {};

/**
 * На каждое сообщение боту отвечаем нашей игрой.
 * К сообщению с игрой можно прикрепить кнопку для начала игры
 * и кнопку для отправки её друзьям, мы реализуем обе
 */
bot.on("message", (msg) => {
  const { id } = msg.chat;

  bot.sendGame(id, GAME_NAME, {
    "reply_markup": {
      "inline_keyboard": [
        [
          {
            text: "Играть",
            callback_game: "",
          },
          {
            text: "Отправить друзьям",
            switch_inline_query: "",
          },
        ],
      ],
    },
  })
});

/**
 * Ответ на запросы inline_query позволит нам отправлять игру друзьям в любом чате,
 * просто написав в поле ввода сообщений юзернейм бота с игрой
 */
bot.on("inline_query", (query) => {
  bot.answerInlineQuery(query.id, [{
    type: "game",
    id: GAME_NAME,
    game_short_name: GAME_NAME,
  }])
});

/**
 * При нажатии на кнопку «Играть» выдаём пользователю 
 * специально помеченную ссылку на игру — так мы будем знать, 
 * кто именно и из какого чата сейчас играет в игру
 */
bot.on("callback_query", (query) => {
  queries[query.id] = query;

  bot.answerCallbackQuery(query.id, { url: `${GAME_URL}?id=${query.id}` });
});

/**
 * Инициализируем веб-сервер для отдачи статичных файлов игры и отправки очков
 */
const app = express();

/**
 * Раздаём файлы: в нашем случае они лежат рядом, в папке t-rex-game
 */
app.use(express.static(path.join(__dirname, "t-rex-game")));

/**
 * Главная функция сервера — отправка очков, полученных пользователем в игре, на сервер Telegram
 * Она принимает количество очков и идентификатор пользователя, который мы выдали ранее
 */
app.get("/highscore/:score", function(req, res, next) {
  if (!queries[req.query.id]) return next();

  const query = queries[req.query.id];
  const score = parseInt(req.params.score) || 0;

  let options;
  if (query.message) {
    options = {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
    };
  } else {
    options = {
      inline_message_id: query.inline_message_id,
    };
  }

  bot.setGameScore(query.from.id, score, options).then((res) => {
    console.log("Score updated!", res);
  }).catch((err) => {
    console.log("Score update error!", err);
  });

  delete queries[req.query.id];
  res.end();
});

/**
 * Запускаем наш сервер, всё готово к работе!
 */
app.listen(3000);
