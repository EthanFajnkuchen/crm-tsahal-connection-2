export interface ChangeRequest {
  id: number;
  leadId: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  dateModified: string;
}

export interface CreateChangeRequestDto {
  leadId: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  dateModified: string;
}
