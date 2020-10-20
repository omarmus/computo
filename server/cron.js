const rp = require('request-promise')
const redis = require('redis')
const time = 3600 // Tiempo en segundos que dura el cacheo en Redis

const client = redis.createClient()

client.on('error', (err) => {
  console.log('Error REDIS: ' + err)
})

const sitios = {
  bolivia: {
    url: 'presidente',
    body: {}
  },
  exterior: {
    url: 'presidente/exterior',
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

function getQuery (url = '', path = '', body = {}) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://computo.oep.org.bo/api/v1/resultado/${url}`

    rp({ method: 'POST', uri: searchUrl, body, json: true })
      .then(response => {
        client.setex(`computo:${path}`, time, JSON.stringify({ source: 'Redis Cache', ...response }))
        resolve({ source: 'Computo API', ...response })
      })
      .catch(err => {
        reject(err)
      })
  })
}

(async () => {
  try {
    for (let sitio in sitios) {
      const result = await getQuery(sitios[sitio].url, sitio, sitios[sitio].body)
      console.log(sitio.toUpperCase() + ':', result.correcto)
    }
  } catch (error) {
    console.log('ERROR CRON:', error.message)
  }
  process.exit(1)
})()
