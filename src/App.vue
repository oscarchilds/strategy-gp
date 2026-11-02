<script setup lang="ts">
import { ref, computed } from 'vue'

type driver = {
  firstName: string
  lastName: string
  lap: number
  distanceDriven: number
  topSpeedInMilesPerHour: number
}

const raceStartTime = ref<number>()
const raceDuration = ref<Date | null>()
const laps = 3
const lapLengthInMiles = 1

const friendlyRaceDuration = computed(() => {
  if (!raceDuration.value) return ""

  const seconds = raceDuration.value
    .getSeconds()
    .toString()
    .padStart(2, "0")

  const milliseconds = raceDuration.value
    .getMilliseconds()
    .toString()
    .padStart(3, "0")

  return `${seconds}:${milliseconds}`
})

const drivers = ref<driver[]>([
  {
    firstName: "Driver",
    lastName: "One",
    lap: 1,
    distanceDriven: 0,
    topSpeedInMilesPerHour: 60
  },
  {
    firstName: "Driver",
    lastName: "Two",
    lap: 1,
    distanceDriven: 0,
    topSpeedInMilesPerHour: 55
  }
])

const startRace = () => {
  raceStartTime.value = Date.now()
  updateRaceDuration()
}

const updateRaceDuration = () => {
  if (!raceStartTime.value) return

  const duration = new Date(Date.now() - raceStartTime.value)
  raceDuration.value = duration

  updateDriverProgress()
  setTimeout(updateRaceDuration, 50)
}

const updateDriverProgress = () => {
  if (!raceDuration.value) return

  const durationHours = raceDuration.value.getTime() / (1000 * 60 * 60)
  drivers.value.forEach(driver => {
    const distance = driver.topSpeedInMilesPerHour * durationHours
    driver.distanceDriven = distance
  })
}
</script>

<template>
  <h1>Driver List</h1>
  <p v-for="driver in drivers">{{ driver.firstName }} {{ driver.lastName}} {{ driver.distanceDriven }}</p>
  <button @click="startRace">Start race</button>
  <p v-if="friendlyRaceDuration">Race duration: {{ friendlyRaceDuration }}</p>
</template>

<style scoped></style>
