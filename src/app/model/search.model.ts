export interface SearchResponse<T> {
	data: T[];
	total: number;
	page: number;
	size: number;
}

export interface SearchRequest {
	page: number;
	size: number;
	sort?: string;
	order?: 'asc' | 'desc';
}