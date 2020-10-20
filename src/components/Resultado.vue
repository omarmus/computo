<template>
  <div
    class="result"
    :style="{ borderColor: firstColor }">
    <div class="result-header">
      <h2 class="result-title">{{ titulo }}</h2>
      <div class="result-porcentage">
        AL {{ porcentage }}%
      </div>
      <div class="result-fuente">
        Fuente: <strong><a href="https://computo.oep.org.bo" target="_blank">Computo Oficial</a></strong> <br>
        Última actualización: <strong>{{ lastDate }}</strong>
      </div>
    </div>
    <div class="result-body">
      <div class="candidate"
        v-for="item in partidos"
        :key="item.nombre">
        <div
          class="candidate-photo"
          :style="{ backgroundImage: `url(${item.image})`}">
        </div>
        <div class="candidate-name">{{ item.titulo }}</div>
        <div
          class="candidate-porcentage"
          :style="{ backgroundColor: item.color }">{{ item.porcien }}<span>%</span> </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed } from 'vue'
import partidosData from '../services/partidos'

export default {
  props: {
    path: {
      type: String,
      default: ''
    },
    titulo: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const partidos = ref([])
    const porcentage = ref(0)
    const lastDate = ref('')
    const publicPath = process.env.BASE_URL

    const formatDate = (date = '') => {
      const [fecha, hora] = date.split(' ')
      const now = new Date()
      const [dia, mes, anio] = fecha.split('/')
      if (parseInt(dia) === now.getDate() && parseInt(mes) === now.getMonth() + 1 && parseInt(anio) === now.getFullYear()) {
        return `Hoy a las ${hora.split(':').splice(0, 2).join(':')}`
      } else {
        return `El ${fecha} a Hrs. ${hora}`
      }
    }

    const getData = async () => {
      axios.get(`http://localhost:3000/computo/${props.path}`)
        .then(response => {
          if (response.data.datoAdicional) {
            const data = response.data
            const items = data.datoAdicional.grafica.map(item => {
              item.image = `${publicPath}images/${partidosData[item.nombre].image}`
              item.titulo = partidosData[item.nombre].nombre
              item.color = partidosData[item.nombre].color
              return item
            })

            partidos.value = items.sort((a, b) => b.porcien - a.porcien).splice(0, 4)
            lastDate.value = formatDate(data.fecha)

            const total = data.datoAdicional.tabla.filter(item => item.nombre === 'Total Actas Computadas')

            if (total.length) {
              porcentage.value = total[0].porcien
            }
          }
        })
    }

    if (props.path) {
      getData()
    }

    const firstColor = computed(() => {
      if (partidos.value.length) {
        return partidos.value[0].color
      }
      return ''
    })

    return { partidos, firstColor, porcentage, lastDate }
  }
}
</script>

<style lang="scss">
.result {
  background-color: #262B42;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 3px;
  border-top: 5px solid transparent;
  margin-bottom: 30px;
}
.result-header {
  display: flex;
  flex-direction: row;
}
.result-title {
  background-color: #445060;
  padding: 0px 15px;
  letter-spacing: 5px;
  color: #ffffff;
  font-size: 1.8rem;
  text-transform: uppercase;
  margin: 0 10px 10px 0;
  box-sizing: border-box;
  line-height: 2rem;
}
.result-porcentage {
  background-color: $error;
  padding: 0px 13px 0px 15px;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 4px;
  box-sizing: border-box;
  line-height: 2rem;
}
.result-fuente {
  margin: 0 0 0 10px;

  strong {
    color: $info;
  }

  a {
    color: $info;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
.result-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.candidate {
  max-width: 180px;
  width: 100%;
}
.candidate-photo {
  width: 100%;
  height: 200px;
  background-repeat: none;
  background-size: cover;
  margin-bottom: 5px;
}
.candidate-name {
  text-align: center;
  background: #ffffff;
  padding: 5px 8px;
  color: #232427;
  font-size: 1.3rem;
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 5px;
}
.candidate-porcentage {
  text-align: center;
  padding: 6px 12px;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 900;

  span {
    font-size: 1.4rem;
    color: #93A3C0;
  }
}

@media screen and (max-width: 768px) {
  .candidate {
    max-width: 150px;
  }
  .candidate-photo {
    height: 170px;
  }
  .result-header {
    flex-wrap: wrap;
  }
  .result-title {
    width: 50%;
    margin: 0;
    font-size: 1.4rem;
  }
  .result-porcentage {
    width: 50%;
    margin: 0;
  }
  .result-fuente {
    width: 100%;
    padding: 5px 10px 8px 10px;
    text-align: center;
  }
}

@media screen and (max-width: 600px) {
  .result-body {
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .candidate {
    max-width: 140px;
    width: 50%;
  }
  .candidate-photo {
    height: 120px;
  }
  .candidate-name {
    font-size: 1.1rem;
  }
  .candidate-porcentage {
    font-size: 1.4rem;
    margin-bottom: 10px;
  }
  .result-title {
    width: 100%;
    margin-bottom: 5px;
  }
  .result-porcentage {
    width: 100%;
  }
}

/* @media screen and (max-width: 600px) {

}
@media screen and (max-width: 600px) {

} */
</style>
