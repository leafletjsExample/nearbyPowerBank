import { ref } from 'vue';
import type { Ref } from 'vue';
import { useGeoUtils } from './useGeoUtils.ts';
// @ts-ignore
import { circle as turfCircle } from '@turf/turf';
import L from 'leaflet';

export const useQueryNearbyPoints = (mapObj: Ref) => {
  const circleOverlay = ref();

  const clearCircleOverlay = () => {
    if (circleOverlay.value) {
      circleOverlay.value.remove();
      circleOverlay.value = null;
    }
  };

  /**
   * 获取一个圆的 geoJson
   * @param center 圆的中心点
   * @param radius 圆的半径
   * @param units 半径单位  miles, kilometers, degrees, or radians
   */
  const getCircleGeoJson = (
    center: number[],
    radius: number,
    units = 'kilometers'
  ) => {
    clearCircleOverlay();

    // steps 越大越圆， 圆是由三角形组成的
    const options = { steps: 128, units, properties: {} };
    const circleGeoJson = turfCircle(center, radius, options);

    // 获取 geoJson 的同时同步创建一个覆盖物
    circleOverlay.value = L.geoJSON(circleGeoJson, {
      style: { color: '#3875F6' }
    }).addTo(mapObj.value);

    return circleGeoJson;
  };

  const { getPointListByGeoJson, createMarker } = useGeoUtils();

  const markerLayerGroup = ref();

  const clearMarkerLayerGroup = () => {
    if (markerLayerGroup.value) {
      mapObj.value.removeLayer(markerLayerGroup.value);
      markerLayerGroup.value = null;
    }
  };

  // 查询附近点位
  const queryNearbyPoints = (point: number[], radius = 2) => {
    clearMarkerLayerGroup();

    // 获取根据中心点生成的圆 geoJson
    const circleGeoJson = getCircleGeoJson(point, radius);

    // 根据 geoJson 查询范围点位
    const list = getPointListByGeoJson(circleGeoJson);

    // 生成 marker 点位
    const markerList = list.map((item) => createMarker(item.reverse()));

    // 将点位加载到地图
    markerLayerGroup.value = L.layerGroup(markerList).addTo(mapObj.value);
  };

  // 清除全部
  const clearAllNearbyPoints = () => {
    clearCircleOverlay();
    clearMarkerLayerGroup();
  };

  return {
    queryNearbyPoints,
    clearAllNearbyPoints
  };
};
