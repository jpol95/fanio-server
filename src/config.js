
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://dundermiffling:1Pepperm%40n@localhost/fanio",
    TEST_DATABASE_URL: process.env.DATABASE_TEST_URL || "postgresql://dundermiffling:1Pepperm%40n@localhost/fanio-test", 
    JWT_SECRET: process.env.JWT_SECRET || "zutara", 
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://fanio-client.vercel.app'
  }