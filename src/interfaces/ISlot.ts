export interface ISlot {
    slotId: number;
    timeSlotType: string;
    startTime: string; // Using string to handle time, can be converted to TimeOnly on backend
    endTime: string;   // Using string to handle time, can be converted to TimeOnly on backend
    isActive: boolean;
}

