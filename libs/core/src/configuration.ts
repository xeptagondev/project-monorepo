export default () => ({
  dbConfig: process.env.DB_CONFIG || 'typeorm',
  typeormDatabase: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'testdb',
    synchronize: process.env.NODE_ENV == 'prod' ? false : true,
    autoLoadEntities: true,
    schema: process.env.DB_DEFAULT_SCHEMA || 'public',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'doNotUseThisUserSecretInProduction',
    expireTimeout: process.env.JWT_EXPIRE || '3600s',
  },
});
