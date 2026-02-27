import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { setupSwagger } from './swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import setupRoutes from './routes.js';

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN;

app.use(helmet());
app.use(cors(allowedOrigin ? { origin: allowedOrigin, credentials: true } : undefined));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

setupSwagger(app);

// register routes from a separate module
setupRoutes(app);

app.use(errorHandler);

export default app;