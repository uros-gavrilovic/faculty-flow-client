export interface SearchResponse<T> {
	data: T[];
	total: number;
	page: number;
	size: number;
}

export interface SearchRequest<F = undefined> {
	page: number;
	size: number;
	sortBy?: string;
	direction?: 'ASC' | 'DESC';
	filter?: F;
}