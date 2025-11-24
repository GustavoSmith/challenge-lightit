"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import { usePatients } from "@/app/patients/hooks/use-patients";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PatientCard } from "@/app/patients/components/patient-card";
import { PatientCardSkeleton } from "@/app/patients/components/patient-card-skeleton";
import { PatientForm } from "@/app/patients/components/patient-form";
import {
  ToastContainer,
  useToast,
} from "@/app/patients/components/toast-container";
import type { Patient, PatientFormValues } from "@/app/patients/types";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const {
    patients,
    status,
    error,
    isEmpty,
    refetch,
    updatePatient,
    createPatient,
  } = usePatients();
  const { toasts, showError, showSuccess, dismissToast } = useToast();
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(
    null,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const errorShownRef = useRef(false);

  // Mostrar error en toast si ocurre (solo una vez)
  useEffect(() => {
    if (status === "error" && error && !errorShownRef.current) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cargar los pacientes";
      showError(errorMessage);
      errorShownRef.current = true;
    }
    if (status !== "error") {
      errorShownRef.current = false;
    }
  }, [status, error, showError]);

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setFormOpen(true);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: PatientFormValues) => {
    try {
      if (editingPatient) {
        await updatePatient({ id: editingPatient.id, values });
        showSuccess("¡Paciente actualizado correctamente!");
      } else {
        await createPatient(values);
        showSuccess("¡Paciente creado correctamente!");
      }
      setFormOpen(false);
      setEditingPatient(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingPatient
            ? "Error al actualizar el paciente."
            : "Error al crear el paciente.";
      showError(errorMessage);
    }
  };

  return (
    <div className="bg-background min-h-screen px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-5xl">
                Pacientes
              </h1>
              <p className="text-grey-300 mt-2 text-lg">
                Administra tu base de datos de pacientes con facilidad.
              </p>
            </div>

            <Button
              onPress={handleAddPatient}
              className="flex items-center justify-center gap-2 rounded-full bg-purple-700 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:cursor-pointer hover:bg-purple-800 hover:shadow-lg active:scale-95"
              aria-label="Agregar nuevo paciente"
            >
              <PlusIcon className="h-5 w-5 transition-transform" />
              <span>Nuevo Paciente</span>
            </Button>
          </div>
        </header>

        {status === "pending" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PatientCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-900/30 bg-red-900/10 p-8 text-center">
            <p className="mb-6 font-medium text-red-300">
              Hubo un problema al cargar los pacientes. <br />
              Si el error persiste, contacte al administrador.
            </p>
            <Button
              onPress={() => refetch()}
              className="rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:cursor-pointer hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              Reintentar
            </Button>
          </div>
        )}

        {isEmpty && status === "success" && (
          <div className="border-grey-800 bg-grey-900/50 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-16 text-center text-pretty">
            <div className="rounded-full bg-purple-900/20 p-4">
              <UserGroupIcon className="h-12 w-12 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-white">
              No hay pacientes registrados
            </p>
            <p className="text-grey-400 max-w-sm">
              Comienza agregando tu primer paciente a la base de datos.
            </p>
            <Button
              onPress={handleAddPatient}
              className="mt-8 rounded-full bg-purple-700 px-8 py-3 font-semibold text-white shadow-md transition-all hover:cursor-pointer hover:bg-purple-800 hover:shadow-lg active:scale-95"
            >
              Agregar Paciente
            </Button>
          </div>
        )}

        {status === "success" && !isEmpty && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isExpanded={expandedPatientId === patient.id}
                onToggleExpand={() =>
                  setExpandedPatientId(
                    expandedPatientId === patient.id ? null : patient.id,
                  )
                }
                onEdit={handleEditPatient}
              />
            ))}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {formOpen && (
        <PatientForm
          patient={editingPatient}
          isOpen={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          mode={editingPatient ? "edit" : "create"}
        />
      )}
    </div>
  );
}
