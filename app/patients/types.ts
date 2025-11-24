export interface Patient {
  id: string;
  name: string;
  website: string;
  phone?: string;
  avatar: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientFormValues {
  name: string;
  website: string;
  phone?: string;
  // Campos adicionales para notas o resumen clínico
  notes?: string;
}
