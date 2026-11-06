import { computed, ref } from 'vue'

type Driver = {
  firstName: string
  lastName: string
  lap: number
  percentageLapComplete: number
  timeLapStarted: number | null
  topSpeedInMilesPerHour: number
  positionInRace: number
  finished: boolean
  percentageFuelRemaining: number
  percentageFuelAtStartOfLap: number
}

export function useRace() {
  const raceStartTime = ref<number>()
  const raceDuration = ref<Date | null>()
  const laps = 2
  const lapLengthInMiles = 0.2
  const chequeredFlag = ref(false)

  const friendlyRaceDuration = computed(() => {
    if (!raceDuration.value) return ''

    const minutes = raceDuration.value
      .getMinutes()
      .toString()
      .padStart(2, '0')

    const seconds = raceDuration.value
      .getSeconds()
      .toString()
      .padStart(2, '0')

    const milliseconds = raceDuration.value
      .getMilliseconds()
      .toString()
      .padStart(3, '0')

    return `${minutes}:${seconds}:${milliseconds}`
  })

  const drivers = ref<Driver[]>([
    {
      firstName: 'Driver',
      lastName: 'One',
      lap: 1,
      percentageLapComplete: 0,
      timeLapStarted: null,
      topSpeedInMilesPerHour: 60,
      positionInRace: 1,
      finished: false,
      percentageFuelRemaining: 100,
      percentageFuelAtStartOfLap: 100
    },
    {
      firstName: 'Driver',
      lastName: 'Two',
      lap: 1,
      percentageLapComplete: 0,
      timeLapStarted: null,
      topSpeedInMilesPerHour: 55,
      positionInRace: 2,
      finished: false,
      percentageFuelRemaining: 100,
      percentageFuelAtStartOfLap: 100
    }
  ])

  const startRace = () => {
    const now = Date.now()
    raceStartTime.value = now

    drivers.value.forEach(driver => driver.timeLapStarted = now)

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
    drivers.value.forEach(driver => {
      if (!driver.timeLapStarted || driver.finished) return

      const timeOnThisLap = new Date(Date.now() - driver.timeLapStarted)
      const timeOnThisLapInHours = timeOnThisLap.getTime() / (1000 * 60 * 60)

      const distanceDrivenThisLap = driver.topSpeedInMilesPerHour * timeOnThisLapInHours

      if (distanceDrivenThisLap > lapLengthInMiles) {
        const onFinalLap = driver.lap == laps

        if (onFinalLap) {
          chequeredFlag.value = true
          driver.finished = true
          driver.percentageLapComplete = 100
        } else {
          driver.lap = driver.lap + 1
          driver.timeLapStarted = Date.now()
          driver.percentageLapComplete = 0
          driver.percentageFuelAtStartOfLap = driver.percentageFuelRemaining
        }
      } else {
        driver.percentageLapComplete = (distanceDrivenThisLap / lapLengthInMiles) * 100

        const distanceDrivenInRace = ((driver.lap - 1) + driver.percentageLapComplete / 100) * lapLengthInMiles
        const fuelBurnRateInPercent = 12
        const fuelBurnedInPercent = distanceDrivenInRace / lapLengthInMiles * fuelBurnRateInPercent
        driver.percentageFuelRemaining = 100 - fuelBurnedInPercent
      }
    })
  }

  return {
    drivers,
    friendlyRaceDuration,
    startRace
  }
}
