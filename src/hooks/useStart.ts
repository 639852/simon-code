import { ref, Ref } from 'vue'

export function useStart (
  sequence: Ref<string[]>,
  cycle: CallableFunction
) {
  const counter = ref(0)
  const difficulty = ref('easy')
  const ms = ref()

  return {
    ms,
    counter,
    difficulty,
    async start () {
      if (sequence.value.length > 0) counter.value = 0

      switch (difficulty.value) {
        case 'easy':
          ms.value = 1500
          break

        case 'normal':
          ms.value = 1000
          break

        default:
          ms.value = 400
          break
      }

      counter.value++

      for (let i = 0; i < counter.value; i++) {
        await cycle(ms)
      }
    }
  }
}
