import express from 'express';

const app = express();
const PORT = 5001;

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});