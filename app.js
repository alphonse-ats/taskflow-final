require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const connectDB = require('./config/database');
const { setUser } = require('./middlewares/auth');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

connectDB();

app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(setUser);

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));