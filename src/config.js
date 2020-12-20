
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || "postgresql://dundermiffling:1Pepperm%40n@localhost/fanio",
    TEST_DB_URL: process.env.DB_TEST_URL || "postgresql://dundermiffling:1Pepperm%40n@localhost/fanio-test", 
    JWT_SECRET: process.env.JWT_SECRET || "235711131719232931"
  }