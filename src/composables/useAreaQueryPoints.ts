import { ref, Ref } from 'vue';
// 因为只在这里用所以直接在这里引入即可
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from 'leaflet';
import { useGeoUtils } from './useGeoUtils.ts';

export const useAreaQueryPoints = (mapObj: Ref) => {
  const addPmControls = () => {
    mapObj.value.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawText: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      rotateMode: false,
      oneBlock: true
    });
  };

  const removePmControls = () => {
    mapObj.value.pm.removeControls();
  };

  // 删除绘制的图形
  const polygonLayer = ref();
  const removePmPolygon = () => {
    // 退出删除模式
    mapObj.value.pm.disableGlobalRemovalMode();

    if (polygonLayer.value) {
      mapObj.value.removeLayer(polygonLayer.value);
      polygonLayer.value = null;
    }
  };

  const pmRemove = () => {
    // 清除绘制的元素
    removePmPolygon();
    // 清除所有marker
    clearMarkerLayerGroup();
  };

  const { getPolygonGeoJsonByPoints, getPointListByGeoJson, createMarker } =
    useGeoUtils();

  const markerLayerGroup = ref();

  const clearMarkerLayerGroup = () => {
    if (markerLayerGroup.value) {
      mapObj.value.removeLayer(markerLayerGroup.value);
      markerLayerGroup.value = null;
    }
  };

  // 绘制完成事件
  const pmCreate = (event: any) => {
    pmRemove();

    const layer = event.layer;
    polygonLayer.value = layer;
    const shapeType = layer.pm.getShape(); // 获取绘制图形的类型

    let coordinates: any[] = [];
    // 根据绘制图形的类型获取坐标集合
    switch (shapeType) {
      case 'Polygon':
        coordinates = layer.getLatLngs()[0];
        break;
      case 'Rectangle':
        coordinates = layer.getLatLngs()[0];
        console.log(coordinates, '000');
        break;
      case 'Circle':
        const data = L.PM.Utils.circleToPolygon(layer, 128);
        // @ts-ignore
        coordinates = data?._latlngs?.[0] || [];
        break;
      default:
        break;
    }

    const geoJson = getPolygonGeoJsonByPoints(coordinates);

    // 根据 geoJson 查询范围点位
    const list = getPointListByGeoJson(geoJson);

    // 生成 marker 点位
    const markerList = list.map((item) => createMarker(item.reverse()));

    // 将点位加载到地图
    markerLayerGroup.value = L.layerGroup(markerList).addTo(mapObj.value);
  };

  return {
    removePmPolygon,
    addPmControls,
    removePmControls,
    pmCreate,
    pmRemove
  };
};
