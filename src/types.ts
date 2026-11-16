export type FuelStrategy = 'low' | 'normal' | 'high'

interface Corner {
  startInMiles: number
  lengthInMiles: number
  direction: 'left' | 'right'
}

export interface Circuit {
  name: string
  lapLengthInMiles: number
  corners: Corner[]
}

export interface Driver {
  isPlayer: boolean
  fuelStrategy: FuelStrategy
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
}

export interface PlayerDriver extends Driver {
  pitFuelTarget: number
}

