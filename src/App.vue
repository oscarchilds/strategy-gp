<script setup lang="ts">
import { ref, computed } from 'vue'

type driver = {
  firstName: string
  lastName: string
}

const raceStartTime = ref<int>()
const raceDuration = ref<int>()

const friendlyRaceDuration = computed(() => {
  const seconds = raceDuration.value
    .getSeconds()
    .padStart(2, "0")

  const milliseconds = raceDuration.value
    .getMilliseconds()
    .padStart(3, "0")

  return `${seconds}:${milliseconds}`
})

const drivers: driver[] = [
  {
    firstName: "Driver",
    lastName: "One"
  },
  {
    firstName: "Driver",
    lastName: "Two"
  }
]

const startRace = () => {
  raceStartTime.value = Date.now()
  updateRaceDuration()
}

const updateRaceDuration = () => {
  const duration = new Date(Date.now() - raceStartTime.value)
  raceDuration.value = duration

  setTimeout(updateRaceDuration, 50)
}
</script>

<template>
  <h1>Driver List</h1>
  <p v-for="driver in drivers">{{ driver.firstName }} {{ driver.lastName}}</p>
  <button @click="startRace">Start race</button>
  <p v-if="raceDuration">Race duration: {{ raceDuration.getSeconds() }}:{{ raceDuration.getMilliseconds() }}</p>
</template>

<style scoped></style>
