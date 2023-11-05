import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// index.htmlをホスティング
const app = express();

app.use(express.static(path.join(__dirname)));

app.listen(3000, () => {
    console.log('Server running at port 3000');
});
