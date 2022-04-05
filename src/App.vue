<template>
  <h1>Simon Says</h1>
  <ul ref="fields">
    <li class="blue" @click="play"></li>
    <li class="red" @click="play"></li>
    <li class="yellow" @click="play"></li>
    <li class="green" @click="play"></li>
  </ul>
  <div>
    <h2>Difficulty</h2>
    <div ref="difficulty">
      <label>
        <input
          type="radio"
          value="easy"
          name="difficulty"
          checked
          @change="changeDifficulty"
        >
        Easy
      </label>
      <label>
        <input
          type="radio"
          value="normal"
          name="difficulty"
          @change="changeDifficulty"
        >
        Normal
      </label>
      <label>
        <input
          type="radio"
          value="hard"
          name="difficulty"
          @change="changeDifficulty"
        >
        Hard
      </label>
    </div>
  </div>
  <div>
    <h2>Round: {{ counter }}</h2>
    <button class="button" @click="start">Start</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  data () {
    return {
      counter: 0,
      difficulty: 'easy',
      prevIndex: Infinity
    }
  },
  setup () {
    const fields = ref<HTMLUListElement>()
    const sequence: string[] = []

    return { fields, sequence }
  },
  methods: {
    async start () {
      if (this.sequence.length > 0) this.counter = 0

      let ms
      switch (this.difficulty) {
        case 'easy':
          ms = 1500
          break

        case 'normal':
          ms = 1000
          break

        default:
          ms = 400
          break
      }

      this.counter++

      for (let i = 0; i < this.counter; i++) {
        await this.cycle(ms)
      }
    },
    async cycle (ms: number) {
      const currIndex = Math.floor(Math.random() * 4)
      const index = (currIndex === this.prevIndex)
        ? Math.abs(currIndex - 3)
        : currIndex
      const field = this.fields?.children[index]
      const audio = new Audio(`/sounds/${index + 1}.mp3`)

      this.prevIndex = index
      this.sequence.push(`${field?.className}`)
      field?.setAttribute('style', 'filter: none;')
      audio.play()

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(field?.removeAttribute('style'))
        }, ms)
      )
    },
    play (event: MouseEvent) {
      if (this.sequence.length <= 0) return

      const field = event.target as HTMLLIElement
      const fields = field.parentElement?.children || []
      const index = Array.from(fields).indexOf(field)
      const audio = new Audio(`/sounds/${index + 1}.mp3`)

      if (field.className === this.sequence[0]) {
        this.sequence.shift()
        audio.play()
      } else {
        alert('Game over')
        this.sequence = []
        this.counter = 0
      }

      if (this.sequence.length <= 0 && this.counter > 0) {
        setTimeout(this.start, 1000)
      }
    },
    changeDifficulty (event: InputEvent) {
      this.difficulty = (event.target as HTMLInputElement).value
    }
  }
})
</script>

<style>
body {
  font-family: sans-serif;
  background: #1f282e;
  color: #fff;
}

h1 {
  text-align: center;
  grid-column: 1/3;
}

ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: fit-content;
  justify-self: end;
  grid-row: 2/4;
}

li {
  height: 100px;
  width: 100px;
  list-style: none;
  cursor: pointer;
  filter: brightness(0.7);
  transition: 0.3s;
}

li:hover {
  filter: brightness(0.8);
}

#app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
}

.blue {
  border-radius: 100% 0 0 0;
  background: #2c2cab;
}

.red {
  border-radius: 0 100% 0 0;
  background: #dd3939;
}

.yellow {
  border-radius: 0 0 0 100%;
  background: #bdbd1f;
}

.green {
  border-radius: 0 0 100% 0;
  background: #228922;
}

.button {
  padding: 8px 20px;
  font-size: 20px;
  border: 0;
  border-radius: 15px;
  background: #fff;
  cursor: pointer;
  transition: 0.3s;
}

.button:hover {
  opacity: 0.7;
}
</style>
