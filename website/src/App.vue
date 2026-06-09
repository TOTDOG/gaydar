<script setup lang="ts">
import Navbar from './components/Navbar.vue';


</script>

<template>
  <div tabindex="0" class="container">
    <navbar class="navbar"/>
    <div class="navbar-underlay"></div>
    <router-view class="viewport"/>
  </div>
</template>

<style scoped>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
  }
  .navbar-underlay {
    position: absolute;
    background-color: rgba(210, 116, 36, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 47px;
  }
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    user-select: none;
    flex: 1;
  }
  .viewport {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
</style>
