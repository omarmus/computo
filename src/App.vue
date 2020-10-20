<template>
  <div class="container">
    <Computo />
  </div>
</template>

<script>
import Computo from './components/Computo'

export default {
  name: 'App',
  components: {
    Computo
  }
}
</script>

<style lang="scss">
.container {
  max-width: 860px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20px;
}
</style>
