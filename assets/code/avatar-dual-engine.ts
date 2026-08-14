const config = ref<DigitalHumanConfig | null>(null)
const childRef = ref<AvatarRuntime | null>(null)

// The visitor page only depends on this engine selector and shared interface.
const engine = computed(() => config.value?.engine || 'xfyun')

async function speak(text: string, emotion?: string) {
  return (await childRef.value?.speak(text, emotion)) ?? false
}

function enableAudio() {
  return childRef.value?.enableAudio()
}

function interrupt() {
  return childRef.value?.interrupt()
}

onMounted(async () => {
  config.value = await fetchActiveDigitalHuman()
})

// XfAvatar: cloud video, TTS, lip-sync and expressions.
async function speakWithXfyun(text: string, emotion: string) {
  return avatarPlatform.writeText(text, {
    tts: { emotion: emotionCode(emotion) }
  })
}

// Live2dAvatar: backend TTS audio drives the local Cubism model's mouth.
async function speakWithLive2d(text: string, vcn: string) {
  const result = await synthesizeSpeech({ text, voice: vcn })
  for (const segment of result.segments) {
    const audio = await fetchAudio(segment.audioUrl)
    Live2dManager.getInstance().pushAudioQueue(audio)
  }
}
