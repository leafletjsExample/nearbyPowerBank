import pointList from '../../public/pointList.json';
// @ts-ignore 库的类型导出似乎不正确
import { booleanPointInPolygon, point as turfPoint } from '@turf/turf';
import L from 'leaflet';
import { getAssetsImgFile } from '@/utils/tool.ts';

export const useGeoUtils = () => {
  const getPointListByGeoJson = (geoJson: any) => {
    return pointList.list.filter((item) =>
      booleanPointInPolygon(turfPoint(item.reverse()), geoJson)
    );
  };

  const createMarker = (point: number[]) => {
    const icon = L.icon({
      iconUrl: getAssetsImgFile('mapIcon.png'),
      iconSize: [40, 40]
    });

    return L.marker(point as L.LatLngExpression, { icon });
  };

  // 根据点位获取多边形geoJson
  const getPolygonGeoJsonByPoints = (points: L.LatLng[]) => {
    const list = points.map((item) => [item.lng, item.lat]);

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [list],
        type: 'Polygon'
      }
    };
  };

  return {
    getPointListByGeoJson,
    createMarker,
    getPolygonGeoJsonByPoints
  };
};
