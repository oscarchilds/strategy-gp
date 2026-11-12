<script setup lang="ts">
import { ref } from 'vue'
import { useRace } from './composables/useRace'
import Setup from './components/Setup.vue'
import type { FuelStrategy } from './types'

const fuelStrategies: FuelStrategy[] = ['low', 'normal', 'high']

const inRace = ref(false)

const clickStartRace = (firstName: string, lastName: string, initialFuel: number) => {
  startRace(firstName, lastName, initialFuel)
  inRace.value = true
}

const { playerDriver, rankedDrivers, positionOf, friendlyRaceDuration, startRace } = useRace()
</script>

<template>
  <div v-if="inRace">
    <table>
      <thead>
        <tr>
          <th>Driver</th>
          <th>Position</th>
          <th>Lap</th>
          <th>Lap Progress</th>
          <th>Fuel</th>
          <th>Speed</th>
          <th>In Pits?</th>
          <th>Finished?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in rankedDrivers" :key="driver.lastName">
          <td>{{ driver.firstName }} {{ driver.lastName }}</td>
          <td>{{ positionOf(driver) }}</td>
          <td>{{ driver.lap }}</td>
          <td>{{ Math.trunc(driver.percentageLapComplete) }}%</td>
          <td>{{ Math.trunc(driver.percentageFuelRemaining) }}%</td>
          <td>{{ driver.currentSpeedInMilesPerHour }}mph</td>
          <td>{{ !!driver.dateTimeOfPitIn ? 'In Pit' : '' }}</td>
          <td>{{ driver.finishTime !== null ? "Finished" : "" }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="friendlyRaceDuration">
      <p v-if="friendlyRaceDuration">Race duration: {{ friendlyRaceDuration }}</p>
      <h1>Controls</h1>
      <span>Fuel Target for next Pitstop</span>
      <input type="number" v-model="playerDriver.pitFuelTarget"></input>
      <div>
        <span>Fuel burn</span>
        <button
          v-for="strategy in fuelStrategies"
          :key="strategy"
          :disabled="playerDriver.fuelStrategy === strategy"
          @click="playerDriver.fuelStrategy = strategy"
        >{{ strategy }}</button>
      </div>
      <span v-if="playerDriver.pitThisLap">Pitting this lap</span>
      <button v-if="!playerDriver.pitThisLap" @click="playerDriver.pitThisLap = true">Pit this lap</button>
      <button v-else @click="playerDriver.pitThisLap = false">Cancel pit this lap</button>
    </div>
  </div>
  <Setup v-else @startRace="clickStartRace" />
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
