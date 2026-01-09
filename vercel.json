{
  "version": 2,
  "builds": [
    { "src": "api/analyze.js", "use": "@vercel/node" },
    { "src": "index.html", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/analyze", "dest": "/api/analyze.js" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
