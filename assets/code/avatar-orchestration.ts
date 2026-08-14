async function start(options: AvatarStartOptions): Promise<boolean> {
  if (!hasCredentials) {
    status.value = 'error'; return false
  }
  status.value = 'connecting'
  const ap = new AvatarPlatform()
  platform.value = ap
  ap.setApiInfo(apiInfo as never)
  ap.setGlobalParams(buildGlobalParams(options.avatarId, options.vcn) as never)
  // SDK事件统一收敛为页面可观察的状态
  ap.on(SDKEvents.frame_stop, () => (status.value = 'ready'))
  ap.on(SDKEvents.error, (err: unknown) => {
    status.value = 'error'
    errorMessage.value = normalizeError(err)
  })
  await ap.start({ wrapper: options.wrapper as HTMLDivElement })
  status.value = 'ready'
  return true
}
// 将答案和情绪编码下发给讯飞数字人
async function speak(text: string, emotion?: string): Promise<boolean> {
  const ap = platform.value
  const content = String(text || '').trim()
  if (!ap || !content || status.value === 'error') return false
  try {
    status.value = 'speaking'
    await ap.writeText(content, {
      nlp: false,
      tts: { emotion: emotionCode(emotion), volume: 100 }
    } as never)
    return true
  } catch (err) {
    errorMessage.value = normalizeError(err); return false
  }
}
// 支持游客打断播报，并在离开页面时释放连接
async function interrupt(): Promise<void> {
  try { await platform.value?.interrupt?.() } catch { /* 忽略打断异常 */ }
  if (status.value === 'speaking') status.value = 'ready'
}
function destroy(): void {
  try { platform.value?.destroy?.() } catch { /* 忽略销毁异常 */ }
  platform.value = null
  status.value = 'idle'
}
