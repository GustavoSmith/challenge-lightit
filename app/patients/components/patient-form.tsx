"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  Heading,
  Modal,
  Button,
  TextField,
  Label,
  Input,
  TextArea,
} from "react-aria-components";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Patient, PatientFormValues } from "@/app/patients/types";

interface FormErrors {
  name?: string;
  website?: string;
  phone?: string;
}

export function PatientForm({
  patient,
  isOpen,
  onOpenChange,
  onSubmit,
  mode = patient ? "edit" : "create",
}: {
  patient?: Patient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  mode?: "create" | "edit";
}) {
  const [formData, setFormData] = useState<PatientFormValues>({
    name: patient?.name || "",
    website: patient?.website || "",
    phone: patient?.phone || "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.website.trim()) {
      newErrors.website = "El sitio web es obligatorio";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone =
        "El teléfono debe tener al menos 8 dígitos y un formato válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        website: formData.website.trim(),
        phone: formData.phone?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar paciente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      <div
        className="bg-grey-900/60 fixed inset-0 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />
      <Dialog
        className="bg-grey-800 relative z-10 w-full max-w-lg scale-100 transform overflow-hidden rounded-3xl p-0 text-left align-middle shadow-2xl ring-1 ring-white/5 transition-all sm:scale-100"
        aria-label="Formulario de paciente"
      >
        {({ close }) => (
          <div className="flex max-h-[90vh] flex-col">
            <div className="border-grey-700 border-b px-6 py-5">
              <div className="flex items-center justify-between">
                <Heading className="text-2xl font-bold text-white">
                  {mode === "edit" ? "Editar Paciente" : "Nuevo Paciente"}
                </Heading>
                <Button
                  onPress={close}
                  className="text-grey-300 hover:bg-grey-700 rounded-full p-2 transition-colors hover:cursor-pointer hover:text-white"
                  aria-label="Cerrar"
                  isDisabled={isSubmitting}
                >
                  <XMarkIcon className="h-6 w-6" />
                </Button>
              </div>
              <p className="text-grey-300 mt-1 text-sm">
                {mode === "edit"
                  ? "Modifica los datos del paciente a continuación."
                  : "Completa la información para registrar un nuevo paciente."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6"
              noValidate
            >
              <div className="space-y-5">
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, name: value }))
                  }
                  isRequired
                  isInvalid={!!errors.name}
                  validationBehavior="aria"
                  className="flex flex-col gap-1.5"
                >
                  <Label className="text-grey-300 text-sm font-semibold">
                    Nombre Completo
                  </Label>
                  <Input
                    type="text"
                    className="border-grey-700 bg-grey-900/50 focus:bg-grey-900 w-full rounded-xl border px-4 py-2.5 text-white transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-red-400">
                      {errors.name}
                    </p>
                  )}
                </TextField>

                <TextField
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, website: value }))
                  }
                  isRequired
                  isInvalid={!!errors.website}
                  validationBehavior="aria"
                  className="flex flex-col gap-1.5"
                >
                  <Label className="text-grey-300 text-sm font-semibold">
                    Sitio Web
                  </Label>
                  <Input
                    type="url"
                    className="border-grey-700 bg-grey-900/50 focus:bg-grey-900 w-full rounded-xl border px-4 py-2.5 text-white transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    placeholder="https://ejemplo.com"
                  />
                  {errors.website && (
                    <p className="text-sm font-medium text-red-400">
                      {errors.website}
                    </p>
                  )}
                </TextField>

                <TextField
                  name="phone"
                  value={formData.phone || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, phone: value }))
                  }
                  isInvalid={!!errors.phone}
                  validationBehavior="aria"
                  className="flex flex-col gap-1.5"
                >
                  <Label className="text-grey-300 text-sm font-semibold">
                    Teléfono
                  </Label>
                  <Input
                    type="tel"
                    className="border-grey-700 bg-grey-900/50 focus:bg-grey-900 w-full rounded-xl border px-4 py-2.5 text-white transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    placeholder="+34 123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-sm font-medium text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </TextField>

                <TextField
                  name="notes"
                  value={formData.notes || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, notes: value }))
                  }
                  className="flex flex-col gap-1.5"
                >
                  <Label className="text-grey-300 text-sm font-semibold">
                    Notas (opcional)
                  </Label>
                  <TextArea
                    rows={3}
                    className="border-grey-700 bg-grey-900/50 focus:bg-grey-900 w-full resize-none rounded-xl border px-4 py-2.5 text-white transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    placeholder="Información adicional..."
                  />
                </TextField>
              </div>

              <div className="border-grey-700 mt-8 flex justify-end gap-3 border-t pt-5">
                <Button
                  type="button"
                  onPress={handleClose}
                  className="text-grey-300 hover:bg-grey-700 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:cursor-pointer hover:text-white"
                  isDisabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:cursor-pointer hover:bg-purple-700 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-r-white" />
                      <span>Guardando...</span>
                    </div>
                  ) : mode === "edit" ? (
                    "Guardar Cambios"
                  ) : (
                    "Crear Paciente"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>
    </Modal>
  );
}
