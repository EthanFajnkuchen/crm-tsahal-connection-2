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
