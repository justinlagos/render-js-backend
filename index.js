const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { topics } = req.body;
  // Your logic to generate content based on topics
  res.json({ result: generatedContent });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
