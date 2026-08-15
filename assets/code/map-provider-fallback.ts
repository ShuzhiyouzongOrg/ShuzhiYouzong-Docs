// 节选自项目源代码/web/src/components/map-guide/ScenicMap.vue
const baseProvider = ref<'loading' | 'tencent' | 'leaflet'>('leaflet')
let baseLayer: L.TileLayer | undefined
let tencentMapApi: TencentMapApi | undefined
let tencentMapInstance: TencentMapInstance | undefined
let tencentInitializationAttempt = 0

function activateLeafletFallback() {
  tencentInitializationAttempt += 1
  const map = mapInstance.value
  baseProvider.value = 'leaflet'
  syncAttribution()
  if (!map || !baseLayer) return
  if (!map.hasLayer(baseLayer)) baseLayer.addTo(map)
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
    tencentMapApi = await loadTencentMapSdk(apiKey)
    if (disposed || attempt !== tencentInitializationAttempt || !navigator.onLine) return
    const center = currentTencentCenter()
    if (!center) throw new Error('Tencent map center is unavailable')
    if (!tencentMapInstance) {
      tencentMapInstance = new tencentMapApi.Map(tencentMapElement.value, {
        center: new tencentMapApi.LatLng(center.latitude, center.longitude),
        zoom: mapInstance.value.getZoom(),
        minZoom: props.config.minZoom,
        maxZoom: effectiveMaxZoom(),
        pitch: 0,
        rotation: 0,
        showControl: false
      })
    } else {
      syncTencentView()
    }
    baseProvider.value = 'tencent'
    if (baseLayer && mapInstance.value.hasLayer(baseLayer))
      baseLayer.removeFrom(mapInstance.value)
    syncAttribution()
  } catch {
    if (!disposed && attempt === tencentInitializationAttempt) activateLeafletFallback()
  }
}
