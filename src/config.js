module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://todo_user@localhost/todos',
  LIVE_DB_URL: process.env.LIVE_DB_URL || 'postgres://xdjvdiosbkdlzb:92c632986d6d071ce84bce359c4170ed05bcab8849016fcf0a86cc05440464f1@ec2-50-17-90-177.compute-1.amazonaws.com:5432/dd7cljp2hgjsgd'
}
