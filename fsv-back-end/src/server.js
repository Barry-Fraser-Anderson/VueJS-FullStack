import express from 'express';

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello!');
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
