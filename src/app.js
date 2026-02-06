import express from 'express'
import cors from 'cors';
import router from './routes/pessoas.route.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const pessoasRoute = router;
app.use("/pessoas", pessoasRoute);

export default app;