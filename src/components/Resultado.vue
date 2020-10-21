<template>
  <div
    class="result"
    :style="{ borderColor: firstColor }">
    <div class="result-header">
      <h2 class="result-title">{{ titulo }} <span v-if="path === 'bolivia'"> + Exterior</span></h2>
      <div class="result-porcentage">
        AL {{ porcentage }}%
      </div>
      <div class="result-fuente">
        Fuente: <strong><a href="https://computo.oep.org.bo" target="_blank">Cómputo Oficial</a></strong> <br>
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
import { ref, computed, onBeforeUnmount } from 'vue'
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
    let interval

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

    const getData = () => {
      axios.get(`${process.env.VUE_APP_API_URL}/computo/${props.path}`)
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
      interval = window.setInterval(getData, 90000)
    }

    onBeforeUnmount(() => {
      window.clearInterval(interval)
    })

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

<style lang="scss" src="./resultado.scss" />
