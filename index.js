const fetch = require('node-fetch');

exports.numberTrivia = (req, res) => {
  const promises = req.body.events.map(({ message, replyToken }) => {
    return fetch(`http://numbersapi.com/${message.text}`)
      .then(res => res.text())
      .then(result =>
        fetch(`https://api.line.me/v2/bot/message/reply`, {
          method: 'POST',
          body: JSON.stringify({
            replyToken,
            messages: [{ type: 'text', text: result }]
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
        })
      );
  });

  Promise.all(promises)
    .then(() => res.json({ success: true }));
};
