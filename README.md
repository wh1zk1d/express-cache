# Express + In-Memory Cache

This is a small demo project to show how easy it is to add server side in-memory caching to an Express.js app. It uses [memory-cache](https://github.com/ptarjan/node-cache) to enable caching.

For every endpoint, a custom cache can be defined by using a simple middleware, which takes the cache duration (in minutes) as a param.

Use it like this:

```javascript
app.get('/products', cacheMiddleware(15), (req, res) => {
  ...
}
```
