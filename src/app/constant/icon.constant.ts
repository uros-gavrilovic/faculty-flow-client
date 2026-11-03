import { Building, RoomType } from '../model/room.model';
import { EventType } from '../model/reservation.model';

export const ROOM_TYPE_ICONS: Record<RoomType, string> = {
	[RoomType.CLASSROOM]: 'pi pi-book',
	[RoomType.AMPHITHEATER]: 'pi pi-users',
	[RoomType.COMPUTER_LAB]: 'pi pi-desktop',
	[RoomType.OFFICE]: 'pi pi-briefcase',
	[RoomType.OTHER]: 'pi pi-th-large',
};

export const BUILDING_ICONS: Record<Building, string> = {
	[Building.OLD]: 'pi pi-building-columns',
	[Building.NEW]: 'pi pi-building',
};

export const EVENT_TYPE_ICONS: Record<EventType, string> = {
	[EventType.LECTURE]: 'pi pi-graduation-cap',
	[EventType.EXERCISE]: 'pi pi-pencil',
	[EventType.LABORATORY]: 'pi pi-desktop',
	[EventType.EXAM]: 'pi pi-file-edit',
	[EventType.CONSULTATION]: 'pi pi-comments',
	[EventType.OTHER]: 'pi pi-ellipsis-h',
};
