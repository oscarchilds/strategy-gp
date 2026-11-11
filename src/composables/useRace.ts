import { computed, ref } from 'vue'

type Driver = {
  firstName: string
  lastName: string
  lap: number
  percentageLapComplete: number
  distanceDrivenInMiles: number
  dateTimeOfLastDistanceCheck: Date | null
  timeLapStarted: number | null // Can we remove this soon?
  currentSpeedInMilesPerHour: number
  positionInRace: number
  finished: boolean
  percentageFuelRemaining: number
  pitThisLap: boolean
  dateTimeOfPitIn: Date | null
  speedBeforePit: number | null
}

export function useRace() {
  const raceStartTime = ref<number>()
  const raceDuration = ref<Date | null>()
  const laps = 2
  const lapLengthInMiles = 0.2
  const chequeredFlag = ref(false)
  const fuelBurnedPerLapInPercent = 75 // at the reference speed
  const referenceSpeedInMilesPerHour = 60
  const fuelBurnSpeedExponent = 1.5 // >1 makes going faster cost more fuel per mile

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

  const playerDriver = ref<Driver>({
    firstName: 'Driver',
    lastName: 'One',
    lap: 1,
    percentageLapComplete: 0,
    distanceDrivenInMiles: 0,
    dateTimeOfLastDistanceCheck: null,
    timeLapStarted: null,
    currentSpeedInMilesPerHour: 60,
    positionInRace: 1,
    finished: false,
    percentageFuelRemaining: 100,
    pitThisLap: false,
    dateTimeOfPitIn: null,
    speedBeforePit: null
  })

  const drivers = ref<Driver[]>([
    playerDriver.value,
    {
      firstName: 'Driver',
      lastName: 'Two',
      lap: 1,
      percentageLapComplete: 0,
      distanceDrivenInMiles: 0,
      dateTimeOfLastDistanceCheck: null,
      timeLapStarted: null,
      currentSpeedInMilesPerHour: 55,
      positionInRace: 2,
      finished: false,
      percentageFuelRemaining: 100,
      pitThisLap: false,
      dateTimeOfPitIn: null,
      speedBeforePit: null
    }
  ])

  const startRace = () => {
    const now = Date.now()
    raceStartTime.value = now

    drivers.value.forEach(driver =>
    {
      driver.timeLapStarted = now
      driver.dateTimeOfLastDistanceCheck = new Date(now)
    })

    updateRaceDuration()
  }

  const updateRaceDuration = () => {
    if (!raceStartTime.value) return

    if (drivers.value.every(x => x.finished)) return

    const duration = new Date(Date.now() - raceStartTime.value)
    raceDuration.value = duration

    updateDriverProgress()
    setTimeout(updateRaceDuration, 50)
  }

  const updateDriverProgress = () => {
    drivers.value.forEach(driver => {
      if (!driver.timeLapStarted || !driver.dateTimeOfLastDistanceCheck || driver.finished) return

      const dateTimeOfThisCheck = new Date(Date.now())

      const timeSinceLastDistanceCheck = new Date(dateTimeOfThisCheck.getTime() - driver.dateTimeOfLastDistanceCheck.getTime())
      const timeSinceLastDistanceCheckInHours = timeSinceLastDistanceCheck.getTime() / (1000 * 60 * 60)

      const distanceDrivenSinceLastDistanceCheck = driver.currentSpeedInMilesPerHour * timeSinceLastDistanceCheckInHours

      driver.distanceDrivenInMiles += distanceDrivenSinceLastDistanceCheck
      driver.dateTimeOfLastDistanceCheck = dateTimeOfThisCheck

      const speedFactor = driver.currentSpeedInMilesPerHour / referenceSpeedInMilesPerHour
      const fuelBurnedInPercent =
        (distanceDrivenSinceLastDistanceCheck / lapLengthInMiles) *
        fuelBurnedPerLapInPercent *
        speedFactor ** fuelBurnSpeedExponent

      driver.percentageFuelRemaining = Math.max(0, driver.percentageFuelRemaining - fuelBurnedInPercent)

      if (driver.percentageFuelRemaining < 5 && driver.currentSpeedInMilesPerHour > 20) {
        driver.currentSpeedInMilesPerHour = 20
      }

      const stillInPits =
        driver.dateTimeOfPitIn !== null &&
        dateTimeOfThisCheck.getTime() - driver.dateTimeOfPitIn.getTime() < 10_000

      if (stillInPits) return

      if (driver.dateTimeOfPitIn !== null) {
        driver.dateTimeOfPitIn = null
        driver.pitThisLap = false
        driver.currentSpeedInMilesPerHour = driver.speedBeforePit ?? driver.currentSpeedInMilesPerHour
        driver.speedBeforePit = null
        driver.percentageFuelRemaining = 100
      }

      const distanceDrivenOnThisLap = driver.distanceDrivenInMiles - (driver.lap - 1) * lapLengthInMiles

      if (distanceDrivenOnThisLap > lapLengthInMiles) {
        const onFinalLap = driver.lap == laps

        if (onFinalLap) {
          chequeredFlag.value = true
          driver.finished = true
          driver.percentageLapComplete = 100
        } else {
          if (driver.pitThisLap)
          {
            driver.dateTimeOfPitIn = dateTimeOfThisCheck
            driver.speedBeforePit = driver.currentSpeedInMilesPerHour
            driver.currentSpeedInMilesPerHour = 0
            return
          }

          driver.lap = driver.lap + 1
          driver.timeLapStarted = Date.now()
          driver.percentageLapComplete = 0
        }
      } else {
        driver.percentageLapComplete = (distanceDrivenOnThisLap / lapLengthInMiles) * 100
      }
    })
  }

  return {
    playerDriver,
    drivers,
    friendlyRaceDuration,
    startRace
  }
}
