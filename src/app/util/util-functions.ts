export function formatToLocalDateTimeString(d: Date): string {
	const pad = (n: number) => String(n).padStart(2, '0');

	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toLocalDateTime(dateTimeString: string): Date {
	const [datePart, timePart] = dateTimeString.split('T');

	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = timePart.split(':').map(Number);

	return new Date(year, month - 1, day, hour + 2, minute);
}

export function filterEmptyFields(value: any): any {
	return Object.fromEntries(
		Object.entries(value).filter(([_, v]) => v != null && v !== ''),
	);
}