const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const fibonacci = require('./fibonacci.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

const redisClient = redis.createClient({ host: 'redis-server', port: 6379 });

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/fibonacci', (req, res)=>{

  const number =  req.body.number;

  redisClient.get(number, (error, value)=>{


    if(!value){
      const result = fibonacci(number);
      redisClient.set(number, result)
      res.render('fibonacci', { number: number, result: result });
    }else{
      res.render('fibonacci', { number: number, result: value });
    }
  });
});

app.listen(8000, () => console.log('Escuchando en puerto 8000'));
