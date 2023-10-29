<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useQueryNearbyPoints } from '@/composables/useQueryNearbyPoints.ts';

const InitMap = defineAsyncComponent(() => import('@/components/InitMap.vue'));

const mapObj = ref();

const { queryNearbyPoints } = useQueryNearbyPoints(mapObj);

const moveQueryNearbyPoints = () => {
  // 获取移动后的地图中心点
  const center = mapObj.value.getCenter();
  // 根据中心点查询指定半径内的点位
  queryNearbyPoints([center.lng, center.lat]);
};

const mapLoad = (map) => {
  mapObj.value = map;
  moveQueryNearbyPoints();
  mapObj.value.on('moveend', moveQueryNearbyPoints);
};
</script>

<template>
  <div class="map-box">
    <init-map class="map" @mapLoad="mapLoad"></init-map>
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
