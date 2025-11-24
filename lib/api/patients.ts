import type { Patient } from "@/app/patients/types";

const API_BASE_URL = "https://63bedcf7f5cfc0949b634fc8.mockapi.io/users";

interface ApiPatient {
  id: string;
  name: string;
  avatar: string;
  description: string;
  website: string;
  createdAt: string;
}

function normalizePatient(apiPatient: ApiPatient): Patient {
  return {
    id: apiPatient.id,
    name: apiPatient.name,
    website: apiPatient.website,
    phone: undefined,
    avatar: apiPatient.avatar,
    createdAt: apiPatient.createdAt,
    updatedAt: undefined,
  };
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener pacientes: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ApiPatient[];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(normalizePatient);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Error al obtener pacientes: ${error.message}`
        : "Error desconocido al obtener pacientes",
    );
  }
}
