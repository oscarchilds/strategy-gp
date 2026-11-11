<script setup lang="ts">
import { useRace } from './composables/useRace'

const { playerDriver, drivers, friendlyRaceDuration, startRace } = useRace()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Driver</th>
        <th>Position</th>
        <th>Lap</th>
        <th>Lap Progress</th>
        <th>Fuel</th>
        <th>Speed</th>
        <th>Finished?</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="driver in drivers">
        <td>{{ driver.firstName }} {{ driver.lastName }}</td>
        <td>{{ driver.positionInRace }}</td>
        <td>{{ driver.lap }}</td>
        <td>{{ Math.trunc(driver.percentageLapComplete) }}%</td>
        <td>{{ Math.trunc(driver.percentageFuelRemaining) }}%</td>
        <td>{{ driver.currentSpeedInMilesPerHour }}mph</td>
        <td>{{ driver.finished ? "Finished" : "" }}</td>
      </tr>
    </tbody>
  </table>
  <button @click="startRace">Start race</button>
  <p v-if="friendlyRaceDuration">Race duration: {{ friendlyRaceDuration }}</p>
  <h1>Controls</h1>
  <button v-if="!playerDriver.pitThisLap" @click="playerDriver.pitThisLap = true">Pit this lap</button>
  <button v-else @click="playerDriver.pitThisLap = false">Cancel pit this lap</button>
</template>

<style scoped>
:global(body) {
  background: #111827;
  color: #f3f4f6;
}

td {
  text-align: center;
}

button {
  background: #1f2937;
  color: #f3f4f6;
}
</style>
