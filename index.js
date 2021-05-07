const express = require('express');
const cors = require('cors');
const app = express();

const router = require('./src/routes/api');

app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 7878
app.listen(PORT, () => {
  console.log(`API Started on http://localhost:${PORT}`);
});
