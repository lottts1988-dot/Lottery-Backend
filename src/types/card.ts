export interface TCard {
  icon: string;
  name: string;
}

export interface GetCard {
  page?: number;
  limit?: number;
  name?: string;
}

export interface CardFilter {
  name?: string;
}
