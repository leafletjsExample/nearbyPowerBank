<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useQueryNearbyPoints } from '@/composables/useQueryNearbyPoints.ts';
import { useAreaQueryPoints } from '@/composables/useAreaQueryPoints.ts';

const InitMap = defineAsyncComponent(() => import('@/components/InitMap.vue'));

const mapObj = ref();

const { queryNearbyPoints, clearAllNearbyPoints } =
  useQueryNearbyPoints(mapObj);

const moveQueryNearbyPoints = () => {
  // 非附近充电宝模式直接返回
  if (mode.value !== '01') {
    return;
  }

  // 获取移动后的地图中心点
  const center = mapObj.value.getCenter();
  // 根据中心点查询指定半径内的点位
  queryNearbyPoints([center.lng, center.lat]);
};

const { addPmControls, removePmControls, pmCreate, pmRemove } =
  useAreaQueryPoints(mapObj);

// 01 附近充电宝 02 区域检索
const mode = ref('01');
const modeChange = (type: string) => {
  mode.value = type;
  if (type === '01') {
    moveQueryNearbyPoints();

    // 删除 pm 操作按钮
    removePmControls();
    pmRemove();
  } else {
    // 添加 pm 操作按钮
    addPmControls();
    clearAllNearbyPoints();
  }
};

const mapLoad = (map: any) => {
  mapObj.value = map;

  moveQueryNearbyPoints();
  mapObj.value.on('moveend', moveQueryNearbyPoints);

  /**
   * pm 国际化
   */
  mapObj.value.pm.setLang('zh');
  // 监听 绘制完成事件
  mapObj.value.on('pm:create', pmCreate);
  // 监听 图形删除事件
  mapObj.value?.on('pm:remove', pmRemove);
};
</script>

<template>
  <div class="map-box">
    <div class="controls-box">
      <div class="radio-box">
        <p
          :class="['item', { active: mode === '01' }]"
          @click="modeChange('01')"
        >
          附近充电宝
        </p>
        <p
          :class="['item', { active: mode === '02' }]"
          @click="modeChange('02')"
        >
          区域查询
        </p>
      </div>
    </div>

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

  .controls-box {
    position: absolute;
    right: 40px;
    top: 10px;
    z-index: 100;
  }

  .radio-box {
    display: flex;
    align-items: center;
    justify-content: right;

    .item {
      margin-right: 8px;
      padding: 4px 8px;
      border: 1px solid #9499ff;
      background: #bcc0ff;
      cursor: pointer;
      border-radius: 4px;
      color: #fff;

      &:hover {
        opacity: 0.9;
      }
    }

    .info {
      background: #747bff;
    }

    .active {
      background: #646cff;
    }
  }
}
</style>
