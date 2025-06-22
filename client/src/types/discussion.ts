export interface Discussion {
  ID: number;
  id_lead: number;
  date_discussion: string;
  contenu: string;
  lead?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateDiscussionDto {
  id_lead: number;
  date_discussion: string;
  contenu: string;
}

export interface UpdateDiscussionDto {
  id_lead?: number;
  date_discussion?: string;
  contenu?: string;
}
