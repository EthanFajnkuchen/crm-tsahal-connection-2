export interface ChangeRequest {
  id: number;
  leadId: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  dateModified: string;
  lead?: {
    firstName: string;
    lastName: string;
    ID: number;
  };
}

export interface CreateChangeRequestDto {
  leadId: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  dateModified: string;
}

export interface GroupedChangeRequest {
  leadId: number;
  lead: {
    firstName: string;
    lastName: string;
    ID: number;
    email?: string;
    phoneNumber?: string;
  };
  requests: ChangeRequest[];
  totalCount: number;
  volunteers: string[];
}
