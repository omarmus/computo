<template>
  <h1>Elecciones Generales 2020</h1>
  <Resultado
    v-for="item in items"
    :key="item.path"
    :path="item.path"
    :titulo="item.titulo" />
</template>

<script>
import Resultado from './Resultado'

export default {
  data () {
    return {
      items: [
        {
          path: 'bolivia',
          titulo: 'Bolivia'
        },
        {
          path: 'beni',
          titulo: 'Beni'
        },
        {
          path: 'chuquisaca',
          titulo: 'Chuquisaca'
        },
        {
          path: 'cochabamba',
          titulo: 'Cochabamba'
        },
        {
          path: 'la-paz',
          titulo: 'La Paz'
        },
        {
          path: 'oruro',
          titulo: 'Oruro'
        },
        {
          path: 'pando',
          titulo: 'Pando'
        },
        {
          path: 'potosi',
          titulo: 'Potosi'
        },
        {
          path: 'santa-cruz',
          titulo: 'Santa Cruz'
        },
        {
          path: 'tarija',
          titulo: 'tarija'
        }
      ]
    }
  },
  components: {
    Resultado
  }
}
</script>
