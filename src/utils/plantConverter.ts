import { Plant, PlantProps } from '../models'

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
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): any {
    const data = snapshot.data(options);
    return new Plant(data as PlantProps);
  }
}
