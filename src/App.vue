<template>
  <div class="container">
    <Computo />
    <div class="footer">
      <a href="https://omarmus.com">omarmus.com</a> - {{ new Date().getFullYear() }}
    </div>
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
.footer {
  text-align: center;
  font-size: .7rem;

  a {
    color: #ffffff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
