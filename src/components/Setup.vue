<script setup lang="ts">
import { ref } from 'vue'

const firstName = ref('')
const lastName = ref('')
const initialFuel = ref(100)

const emit = defineEmits<{
  startRace: [firstName: string, lastName: string, initialFuel: number]
}>()

const clickStartRace = () => {
  emit('startRace', firstName.value, lastName.value, initialFuel.value)
}
</script>

<template>
  <h1>Race setup</h1>
  <p>Laps: 4</p>
  <p>Fuel burn per lap: ~40%</p>
  <p>Driver First Name</p>
  <input v-model="firstName" type='text'></input>
  <p>Driver Last Name</p>
  <input v-model="lastName" type='text'></input>
  <p>Fuel load at start of race</p>
  <input v-model="initialFuel" type='number'></input>
  <p>Start race</p>
  <button @click="clickStartRace">Start race</button>
</template>
