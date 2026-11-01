export function formatToLocalDateTimeString(value: Date | string | undefined): string {
	if (!value) return '';

	const d = typeof value === 'string' ? new Date(value) : value;

	const pad = (n: number) => String(n).padStart(2, '0');

	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function filterEmptyFields(value: any): any {
	return Object.fromEntries(
		Object.entries(value).filter(([_, v]) => v != null && v !== ''),
	);
}