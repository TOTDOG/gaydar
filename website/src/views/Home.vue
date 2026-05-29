<script setup lang="ts">
</script>

<template>
  <div class="content-wrapper">
    <div class="head-banner">
      <img class="logo" src="../assets/PNG/Asset 6@8x.png" alt="Company Logo"/>
      <div class="overlay"></div>
      <div class="blurb">
        <p>An unbiased (not really) approach to detecting fruit.</p>
      </div>
      <div class="blurb">
        <p>An unbiased (not really) approach to detecting fruit.</p>
      </div>
      <div class="blurb" id="easter-egg">
        <p>Boo!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content-wrapper::-webkit-scrollbar {
  display: none;
}

.head-banner {
  height: 100%;
  min-height: fit-content;
  width: 100%;
  position: relative;
}

.logo {
  margin: 15px 0 0 0;
  width: 100%;
  height: auto;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  height: max(calc(100vh - 48px), 100%);
  background-color: rgba(210, 116, 36, 0.5);
}

.blurb {
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  top: 20%;
  padding: 0;
  color: wheat;
  font-weight: 500;
  font-size: clamp(0px, 6vw, 20px);
  text-align: center;
}

.blurb p {
  margin: 0;
}

.blurb::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 300%;
  background: radial-gradient(ellipse, rgba(210, 113, 36, .5) 0%, rgba(210, 113, 36, 0) 70%);
  mask: radial-gradient(ellipse, black 20%, transparent 70%);
  backdrop-filter: blur(10px);
  z-index: -1;
}

#easter-egg {
  top: 90%;
}
</style>