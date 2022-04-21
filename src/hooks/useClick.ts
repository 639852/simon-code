import { Ref } from 'vue'

export function useClick (
  sequence: Ref<string[]>,
  counter: Ref<number>,
  start: CallableFunction,
  ms: Ref<number>
) {
  return {
    async onClick (event: MouseEvent) {
      if (sequence.value.length <= 0) return

      const field = event.target as HTMLLIElement
      const fields = field.parentElement?.children || []
      const index = Array.from(fields).indexOf(field)
      const audio = new Audio(`/sounds/${index + 1}.mp3`)

      if (field.className === sequence.value[0]) {
        field?.setAttribute('style', 'filter: none;')
        sequence.value.shift()
        audio.play()

        await new Promise((resolve) =>
          setTimeout(() => {
            resolve(field?.removeAttribute('style'))
          }, ms.value)
        )
      } else {
        alert('Game over')
        sequence.value = []
        counter.value = 0
      }

      if (sequence.value.length <= 0 && counter.value > 0) {
        setTimeout(start, 1000)
      }
    }
  }
}
