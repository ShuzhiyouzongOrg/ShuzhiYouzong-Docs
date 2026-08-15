// 文档节选；完整实现见 web/src/components/map-guide/ScenicMap.vue
const baseProvider = ref<'loading' | 'tencent' | 'leaflet'>('leaflet')
let tencentInitializationAttempt = 0

function activateLeafletFallback() {
  tencentInitializationAttempt += 1
  baseProvider.value = 'leaflet'
  syncAttribution()
  const map = mapInstance.value
  if (map && baseLayer && !map.hasLayer(baseLayer)) baseLayer.addTo(map)
}

async function initializeTencentBaseMap() {
  const apiKey = String(import.meta.env.VITE_TENCENT_MAP_KEY || '').trim()
  if (!apiKey || !navigator.onLine || !tencentMapElement.value || !mapInstance.value) {
    activateLeafletFallback()
    return
  }

  const attempt = ++tencentInitializationAttempt
  baseProvider.value = 'loading'
  try {
    const api = await loadTencentMapSdk(apiKey)
    if (disposed || attempt !== tencentInitializationAttempt || !navigator.onLine) return
    const center = currentTencentCenter()
    if (!center) throw new Error('Tencent map center is unavailable')
    if (!tencentMapInstance) {
      tencentMapInstance = new api.Map(tencentMapElement.value, {
        center: new api.LatLng(center.latitude, center.longitude),
        // minZoom、maxZoom、pitch等展示参数沿用完整源码配置。
        zoom: mapInstance.value.getZoom()
      })
    } else {
      syncTencentView()
    }
    baseProvider.value = 'tencent'
    if (baseLayer && mapInstance.value.hasLayer(baseLayer)) baseLayer.removeFrom(mapInstance.value)
    syncAttribution()
  } catch {
    if (!disposed && attempt === tencentInitializationAttempt) activateLeafletFallback()
  }
}
