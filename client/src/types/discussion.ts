export interface Discussion {
  ID: number;
  id_lead: number;
  date_discussion: string;
  contenu: string;
  lead?: {
    firstName: string;
    lastName: string;
  };
  created_by: string;
}

export interface CreateDiscussionDto {
  id_lead: number;
  date_discussion: string;
  contenu: string;
  created_by: string;
}

export interface UpdateDiscussionDto {
  id_lead?: number;
  date_discussion?: string;
  contenu?: string;
}
