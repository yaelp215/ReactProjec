
type GearType = "automatic" | "manual";

interface BaseCar {
    id: string;
    company: string;
    year: number;
    color: string;
    placeNumber: number;
    gearType: GearType; 
    priceToDay: number;
    imageUrl: string;
    availability: boolean[];
}

export interface ElectricCar extends BaseCar {
    fuelType: "electric";
}

export interface CombustionCar extends BaseCar {
    fuelType: "hybrid" | "fuel";
    fuelConsumption: number; 
}
export type Car = ElectricCar | CombustionCar;