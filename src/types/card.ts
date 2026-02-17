export interface CreateCard {
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

export interface UpdateCard {
  icon: string;
  name: string;
}
