import { computed, ref } from 'vue'

interface Driver {
  firstName: string
  lastName: string
  lap: number
  percentageLapComplete: number
  distanceDrivenInMiles: number
  dateTimeOfLastDistanceCheck: Date | null
  timeLapStarted: number | null // Can we remove this soon?
  currentSpeedInMilesPerHour: number
  finishTime: number | null
  percentageFuelRemaining: number
  pitThisLap: boolean
  dateTimeOfPitIn: Date | null
  speedBeforePit: number | null
}

interface PlayerDriver extends Driver {
  pitFuelTarget: number
}

export function useRace() {
  const raceStartTime = ref<number>()
  const raceDuration = ref<Date | null>()
  const laps = 4
  const lapLengthInMiles = 0.2
  const chequeredFlag = ref(false)
  const fuelBurnedPerLapInPercent = 40 // at the reference speed
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

  const playerDriver = ref<PlayerDriver>({
    firstName: 'Driver',
    lastName: 'One',
    lap: 1,
    percentageLapComplete: 0,
    distanceDrivenInMiles: 0,
    dateTimeOfLastDistanceCheck: null,
    timeLapStarted: null,
    currentSpeedInMilesPerHour: 60,
    finishTime: null,
    percentageFuelRemaining: 100,
    pitThisLap: false,
    dateTimeOfPitIn: null,
    speedBeforePit: null,
    pitFuelTarget: 100
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
      finishTime: null,
      percentageFuelRemaining: 100,
      pitThisLap: false,
      dateTimeOfPitIn: null,
      speedBeforePit: null
    }
  ])

  const rankedDrivers = computed(() =>
    [...drivers.value].sort((a, b) => {
      if (a.finishTime !== null && b.finishTime !== null) return a.finishTime - b.finishTime
      if (a.finishTime !== null) return -1
      if (b.finishTime !== null) return 1
      return b.distanceDrivenInMiles - a.distanceDrivenInMiles
    })
  )

  const positionOf = (driver: Driver) => rankedDrivers.value.indexOf(driver) + 1

  const startRace = (playerFirstName: string, playerLastName: string, initialFuel: number) => {
    playerDriver.value.firstName = playerFirstName
    playerDriver.value.lastName = playerLastName
    playerDriver.value.percentageFuelRemaining = initialFuel

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

    if (drivers.value.every(x => x.finishTime !== null)) return

    const duration = new Date(Date.now() - raceStartTime.value)
    raceDuration.value = duration

    updateDriverProgress()
    setTimeout(updateRaceDuration, 50)
  }

  const updateDriverProgress = () => {
    drivers.value.forEach(driver => {
      if (!driver.timeLapStarted || !driver.dateTimeOfLastDistanceCheck || driver.finishTime !== null) return

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

      const exitPits = driver.dateTimeOfPitIn !== null

      if (exitPits) {
        driver.dateTimeOfPitIn = null
        driver.pitThisLap = false
        driver.currentSpeedInMilesPerHour = driver.speedBeforePit ?? driver.currentSpeedInMilesPerHour
        driver.speedBeforePit = null
        driver.percentageFuelRemaining = playerDriver.value.pitFuelTarget // TODO allow other drivers to pit
      }

      const distanceDrivenOnThisLap = driver.distanceDrivenInMiles - (driver.lap - 1) * lapLengthInMiles

      if (distanceDrivenOnThisLap > lapLengthInMiles) {
        const onFinalLap = driver.lap == laps

        if (onFinalLap) {
          chequeredFlag.value = true
          driver.finishTime = dateTimeOfThisCheck.getTime()
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
    rankedDrivers,
    positionOf,
    friendlyRaceDuration,
    startRace
  }
}
