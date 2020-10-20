const rp = require('request-promise')
const redis = require('redis')
const fastify = require('fastify')({ logger: true })
const port = process.env.PORT || 3000

const client = redis.createClient()

client.on('error', (err) => {
  console.log('Error REDIS: ' + err)
})

fastify.register(require('fastify-cors'), {})

const sitios = {
  bolivia: {
    url: 'presidente',
    body: {}
  },
  beni: {
    url: 'presidente/nacional',
    body: { idDepartamento: 8, idPais: 32 }
  },
  chuquisaca: {
    url: 'presidente/nacional',
    body: { idDepartamento: 1, idPais: 32 }
  },
  cochabamba: {
    url: 'presidente/nacional',
    body: { idDepartamento: 3, idPais: 32 }
  },
  'la-paz': {
    url: 'presidente/nacional',
    body: { idDepartamento: 2, idPais: 32 }
  },
  oruro: {
    url: 'presidente/nacional',
    body: { idDepartamento: 4, idPais: 32 }
  },
  pando: {
    url: 'presidente/nacional',
    body: { idDepartamento: 9, idPais: 32 }
  },
  potosi: {
    url: 'presidente/nacional',
    body: { idDepartamento: 5, idPais: 32 }
  },
  'santa-cruz': {
    url: 'presidente/nacional',
    body: { idDepartamento: 7, idPais: 32 }
  },
  tarija: {
    url: 'presidente/nacional',
    body: { idDepartamento: 6, idPais: 32 }
  }
}

fastify.get('/computo/:sitio', async (req, reply) => {
  const { sitio } = req.params

  if (!sitio) {
    return { error: 'Debe enviar el sitio a buscar' }
  }

  if (!sitios[sitio]) {
    return { error: `No existe el sitio: ${sitio}` }
  }

  try {
    const result = await getQuery(sitios[sitio].url, sitio, sitios[sitio].body)
    return result
  } catch (e) {
    return { error: e.message }
  }
})

function getQuery (url = '', path = '', body = {}) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://computo.oep.org.bo/api/v1/resultado/${url}`

    client.get(`computo:${path}`, (err, result) => {
      if (err) {
        return reject(err)
      }
      if (result) {
        resolve(JSON.parse(result))
      } else {
        rp({ method: 'POST', uri: searchUrl, body, json: true })
          .then(response => {
            client.setex(`computo:${path}`, 180, JSON.stringify({ source: 'Redis Cache', ...response }))
            resolve({ source: 'Computo API', ...response })
          })
          .catch(err => {
            reject(err)
          })
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
