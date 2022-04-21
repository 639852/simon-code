<template>
  <h1>Simon Says</h1>
  <ul ref="fields">
    <li
      v-for="field of fieldsData"
      :key="field"
      :class="field"
      @click="onClick"
    />
  </ul>
  <div>
    <h2>Difficulty</h2>
    <div ref="difficulty">
      <label v-for="label of labels" :key="label.value">
        <input
          type="radio"
          name="difficulty"
          :value="label.value"
          :checked="label.checked"
          @change="changeDifficulty"
        >
        {{ label.text }}
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
import { useStart } from './hooks/useStart'
import { useCycle } from './hooks/useCycle'
import { useClick } from './hooks/useClick'

export default defineComponent({
  name: 'App',
  setup () {
    const fields = ref()

    const fieldsData = ['blue', 'red', 'yellow', 'green']
    const labels = [
      {
        text: 'Easy',
        value: 'easy',
        checked: true
      },
      {
        text: 'Normal',
        value: 'normal'
      },
      {
        text: 'Hard',
        value: 'hard'
      }
    ]

    const { sequence, cycle } = useCycle(fields)
    const { ms, counter, difficulty, start } = useStart(sequence, cycle)
    const { onClick } = useClick(sequence, counter, start, ms)

    function changeDifficulty (event: InputEvent) {
      difficulty.value = (event.target as HTMLInputElement).value
    }

    return { fields, counter, start, onClick, changeDifficulty, fieldsData, labels }
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
