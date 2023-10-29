<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const InitMap = defineAsyncComponent(() => import('@/components/InitMap.vue'));
</script>

<template>
  <div class="map-box">
    <init-map class="map"></init-map>
  </div>
</template>

<style scoped>
.map-box {
  position: relative;
  width: 100vw;
  height: 100vh;

  .map {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
