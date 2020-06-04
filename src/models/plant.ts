export interface Plant {
    id: string,
    name?: string,
    lastWatered?: string, // UTC date
    lastFertilized?: string, // UTC date
    wateringDates: string[],
    fertilizingDates: string[],
}
