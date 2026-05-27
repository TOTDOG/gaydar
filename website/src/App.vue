<script setup lang="ts">
import Navbar from './components/Navbar.vue';


</script>

<template>
  <navbar class="navbar"/>
  <div class="navbar-underlay"></div>
  <router-view class="viewport"/>
</template>

<style scoped>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    backdrop-filter: blur(10px);
  }
  .navbar-underlay {
    position: absolute;
    background-color: rgba(210, 116, 36, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 47px;
  }
</style>
