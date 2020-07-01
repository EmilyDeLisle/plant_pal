import { Plant, PlantProps } from '../models'
import { getStorage } from '../firebase'

export const plantConverter = {
  toFirestore: (plant: Plant) => {
    const {
      id,
      name,
      altName,
      wateringDates,
      fertilizingDates,
      lastCheckedDate,
      imageFileName,
    } = plant
    return {
      id: id,
      name: name,
      altName: altName,
      wateringDates: wateringDates,
      fertilizingDates: fertilizingDates,
      lastCheckedDate: lastCheckedDate,
      imageFileName: imageFileName,
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): any {
    const data = snapshot.data(options)
    const plant = new Plant(data as PlantProps)
    const { id, imageFileName, setImageURL } = plant

    if (!!imageFileName) {
      getStorage().getImage(id, imageFileName, (url: string) => setImageURL(url))
    }
    
    return plant
  },
}
