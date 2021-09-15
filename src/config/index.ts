import * as dotenv from 'dotenv-safe';

dotenv.config({
  allowEmptyValues: false,
  path: process.cwd() + '/.env',
  example: process.cwd() + '/.env.example',
});

export default {
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 3054,
  sqlitePath: process.env.SQLITE_PATH || 'src/database/sqlite.db',
  jwtTokenKey: process.env.JWT_TOKEN_KEY,
  jwtTokenLife: process.env.JWT_TOKEN_LIFE || '2h',
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || '24h',
  cryptoSecretKey: process.env.CRYPTO_SECRET_KEY,
  usersApiUrl: process.env.USERS_API_URL || 'http://127.0.0.1:3051'
};
