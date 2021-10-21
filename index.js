const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cache = require('memory-cache')
const PORT = process.env.PORT || 3000
const app = express()

// Configure cache
const memCache = new cache.Cache()
const cacheMiddleware = duration => {
  return (req, res, next) => {
    try {
      const key = '__express__' + req.originalUrl || req.originalUrl
      const cacheContent = memCache.get(key)

      if (cacheContent) {
        return res.status(200).send(cacheContent)
      } else {
        res.sendResponse = res.send
        res.send = body => {
          memCache.put(key, body, duration * 1000 * 60)
          res.sendResponse(body)
        }
        return next()
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

// Endpoints
app.get('/', (req, res) => {
  return res.json({ message: 'hello world' })
})

app.get('/products', cacheMiddleware(15), (req, res) => {
  setTimeout(() => {
    try {
      const db = new sqlite3.Database('./inventory.db')
      const sql = `SELECT * FROM products`

      db.all(sql, [], (err, rows) => {
        if (err) {
          throw err
        }
        db.close()
        res.json({ products: rows })
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }, 3000)
})

// Start the server
const start = port => {
  try {
    app.listen(port, () => {
      console.log(`API running on port ${port}`)
    })
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

start(PORT)
