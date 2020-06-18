import { Plant } from '../models'

export const plantConverter = {
  toFirestore: (plant: Plant) => {
    const { name, altName, wateringDates, fertilizingDates, lastCheckedDate } = plant
    return {
      name: name,
      altName: altName,
      wateringDates: wateringDates,
      fertilizingDates: fertilizingDates,
      lastCheckedDate: lastCheckedDate,
    }
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options)
    const { id, name, altName, wateringDates, fertilizingDates, lastCheckedDate } = data
    return new Plant(id, name, altName, wateringDates, fertilizingDates, lastCheckedDate)
  },
}
