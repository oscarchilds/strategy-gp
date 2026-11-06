<script setup lang="ts">
import { useRace } from './composables/useRace'

const { drivers, friendlyRaceDuration, startRace } = useRace()
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
        <td>{{ driver.finished ? "Finished" : "" }}</td>
      </tr>
    </tbody>
  </table>
  <button @click="startRace">Start race</button>
  <p v-if="friendlyRaceDuration">Race duration: {{ friendlyRaceDuration }}</p>
</template>

<style scoped>
td {
  text-align: center;
}
</style>
