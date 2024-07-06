const express = require('express');
const bodyParser = require('body-parser');
const contentRoutes = require('./routes/contentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const media = require('./routes/media');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', contentRoutes);
app.use('/api', profileRoutes);
app.use('/api', media);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});