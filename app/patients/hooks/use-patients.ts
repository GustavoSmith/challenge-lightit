import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatients } from "@/lib/api/patients";
import type { Patient, PatientFormValues } from "@/app/patients/types";
import { generateAvatarUrl } from "@/lib/utils";

const QUERY_KEY = ["patients"] as const;

export function usePatients() {
  const queryClient = useQueryClient();

  const {
    data: patients = [],
    status,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchPatients,
  });

  const updatePatientMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: PatientFormValues;
    }) => {
      // Simulación de actualización (no persiste en servidor)
      return { id, ...values };
    },
    onMutate: async ({ id, values }) => {
      // Cancelar queries en curso para evitar sobrescribir la actualización optimista
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousPatients = queryClient.getQueryData<Patient[]>(QUERY_KEY);

      queryClient.setQueryData<Patient[]>(QUERY_KEY, (old = []) =>
        old.map((patient) =>
          patient.id === id
            ? {
                ...patient,
                ...values,
                updatedAt: new Date().toISOString(),
              }
            : patient,
        ),
      );

      return { previousPatients };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPatients) {
        queryClient.setQueryData(QUERY_KEY, context.previousPatients);
      }
    },
  });

  // Mutación para crear un nuevo paciente
  const createPatientMutation = useMutation({
    mutationFn: async (values: PatientFormValues) => {
      return {
        id: `local-${crypto.randomUUID()}`,
        ...values,
        avatar: generateAvatarUrl(),
        createdAt: new Date().toISOString(),
      };
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousPatients = queryClient.getQueryData<Patient[]>(QUERY_KEY);

      const newPatient: Patient = {
        id: `local-${crypto.randomUUID()}`,
        name: values.name,
        website: values.website,
        phone: values.phone,
        avatar: generateAvatarUrl(),
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Patient[]>(QUERY_KEY, (old = []) => [
        ...old,
        newPatient,
      ]);

      return { previousPatients };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPatients) {
        queryClient.setQueryData(QUERY_KEY, context.previousPatients);
      }
    },
  });

  return {
    patients,
    status,
    error,
    isEmpty: status === "success" && patients.length === 0,
    refetch,
    updatePatient: updatePatientMutation.mutateAsync,
    createPatient: createPatientMutation.mutateAsync,
    isUpdating: updatePatientMutation.isPending,
    isCreating: createPatientMutation.isPending,
  };
}
