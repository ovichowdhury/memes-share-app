*App Stack
Node.js
Typescript
Postgres
TypeORM

*Folder structure
api => All the source code for API
api -> src => src without config
api -> src -> app.js => Starting point of application
api -> src -> routes => All the routes to handle api request
api -> src -> middlewares => auth and exception handling middleware
api -> src -> config => app config handle
api -> src -> services => place for service layer (code merged in routes for time)
api -> src -> entity => Typeorm entity folder