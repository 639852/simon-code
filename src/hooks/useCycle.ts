import { ref, Ref } from 'vue'

export function useCycle (fields: Ref<HTMLUListElement>) {
  const sequence = ref<string[]>([])
  const prevIndex = ref(Infinity)

  return {
    sequence,
    async cycle (ms: Ref<number>) {
      const currIndex = Math.floor(Math.random() * 4)
      const index = (currIndex === prevIndex.value)
        ? Math.abs(currIndex - 3)
        : currIndex
      const field = fields.value?.children[index]
      const audio = new Audio(`/sounds/${index + 1}.mp3`)

      audio.play()
      prevIndex.value = index
      sequence.value.push(`${field?.className}`)
      field?.setAttribute('style', 'filter: none;')

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(field?.removeAttribute('style'))
        }, ms.value)
      )
    }
  }
}
