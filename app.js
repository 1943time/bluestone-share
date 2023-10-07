require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const {join, basename} = require('path')
const {createHmac} = require('crypto')
/**
 * @param {*} req 
 */
const verify = (req) => {
  const {date, authorization} = req.headers
  if (Date.now() - Number(date) > 1000 * 60 * 5) return false
  if (createHmac('sha1', process.env.SECRET).update(Number(date).toString(16)).digest('hex') !== authorization) return false
  return true
}

app.use(bodyParser.json({
  limit: 1024 * 1024 * 1024
}))

const libDir = join(__dirname, 'public/lib')
const docDir = join(__dirname, 'public/doc')

app.use(express.static('public'))

app.get('/connect', (req, res) => {
  if (!verify(req)) return res.json({message: 'secret is incorrect'})
  res.json({version: '0.1.0'})
})

app.post('/uploadLib', (req, res) => {
  if (!verify(req)) return res.json({message: 'secret is incorrect'})
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir)
  fs.writeFileSync(join(libDir, req.body.name), req.body.content, {encoding: req.body.name === 'favicon.png' ? 'base64' : 'utf-8'})
  res.json({success: true})
})

app.post('/uploadDoc', (req, res) => {
  if (!verify(req)) return res.json({message: 'secret is incorrect'})
  if (!fs.existsSync(docDir)) fs.mkdirSync(docDir)
  fs.writeFileSync(join(docDir, basename(req.body.name)), req.body.htmlContent, {encoding: 'utf-8'})
  res.json({success: true})
})

app.post('/removeDoc', (req, res) => {
  if (!verify(req)) return res.json({message: 'secret is incorrect'})
  fs.unlinkSync(join(docDir, basename(req.body.name)))
  res.json({success: true})
})

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})
