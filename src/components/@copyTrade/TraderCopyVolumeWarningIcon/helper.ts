export function getCopyVolumeColor({ copyVolume, maxVolume }: { copyVolume: number; maxVolume: number }) {
  const color =
    copyVolume < maxVolume
      ? 'green2'
      : copyVolume === maxVolume
      ? 'orange1'
      : copyVolume > maxVolume
      ? 'red1'
      : 'neutral1'

  return color
}
