const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const createError = require('http-errors');
const connectDB = require('./configs/database');

dotenv.config({ path: './configs/.env' });
connectDB();

const authRouter = require('./routes/auth.route');
const weddingMoneyRouter = require('./routes/wedding-money.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://626a58a34c26280cf9b6785c--verdant-mandazi-17234a.netlify.app',
    allowedHeaders: 'Origin, X-Requested-With, X-Api-Key, Content-Type, Accept, Authorization',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
  })
);

app.use('/api/auth', authRouter);
app.use('/api/wedding-money', weddingMoneyRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound('Có lỗi xảy ra'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});

module.exports = app;
