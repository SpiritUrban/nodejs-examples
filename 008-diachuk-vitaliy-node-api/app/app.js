import { log } from 'high-level';
import { __dirname, serverEntryPoint, pause } from '../my_modules/stuff.js';
import express from 'express';
const app = express();

// connect for running
import db from './db.js';
import passportFile from './passport.js';

// init app
import { settingsService } from '../services/index.js';
settingsService.createIfAbsent();

// parsers
import parsers from './parsers.js';
parsers(app)

// session n passport
import snp from './session-n-passport.js';
snp(app);

// logger
import logger from 'morgan';
app.use(logger('dev'));

// cors
import cors from 'cors'; //............. cors 1
import myCors from './cors.js';//....... cors 2
app.use(cors());
app.use(myCors);

// static server
import path from 'path';
app.use(express.static(path.join(serverEntryPoint(), 'public')));
app.use(express.static(path.join(serverEntryPoint(), 'uploads')));

// file uploader
import fileUploader from './file-uploader.js';
fileUploader(app)

// graphql
import { graphqlHTTP } from 'express-graphql';
import schema from '../schema/schema.js'; // Графічна схема, яку ми ще створимо
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // використовувати інтерфейс GraphiQL для тестування запитів
}));

// routes
import indexRouter from '../routes/index.js';
app.use('/', indexRouter);
app.use((req, res) => res.status(404).end('404'));

export default app;

