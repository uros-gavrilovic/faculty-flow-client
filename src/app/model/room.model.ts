export interface Room {
	uuid: string;
	name: string;
	code: string;
	type: RoomType;
	floor: number;
	building: Building;
	oldName: string;
	capacity: number;
}

export enum Building {
	OLD = 'OLD',
	NEW = 'NEW',
}

export enum RoomType {
	CLASSROOM = 'CLASSROOM',
	AMPHITHEATER = 'AMPHITHEATER',
	COMPUTER_LAB = 'COMPUTER_LAB',
	OFFICE = 'OFFICE',
	OTHER = 'OTHER',
}

export interface RoomFilter {
	name?: string;
	code?: string;
}