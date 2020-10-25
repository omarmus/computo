const redis = require('redis')
const fastify = require('fastify')({ logger: true })
const port = process.env.PORT || 3400

const client = redis.createClient()

client.on('error', (err) => {
  console.log('Error REDIS: ' + err)
})

fastify.register(require('fastify-cors'), {})

fastify.get('/computo/:sitio', async (req, reply) => {
  const { sitio } = req.params

  if (!sitio) {
    return { error: 'Debe enviar el sitio a buscar' }
  }

  try {
    const result = await getQuery(sitio)
    return result
  } catch (e) {
    return { error: e.message }
  }
})

function getQuery (path = '') {
  return new Promise((resolve, reject) => {
    client.get(`computo:${path}`, (err, result) => {
      if (err) {
        return reject(err)
      }
      if (result) {
        resolve(JSON.parse(result))
      } else {
        reject(new Error('No existe el registro'))
      }
    })
  })
}

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
