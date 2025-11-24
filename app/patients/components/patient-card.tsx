"use client";

import { useState, memo } from "react";
import { Button } from "react-aria-components";
import { ChevronDownIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { Patient } from "@/app/patients/types";
import { generateAvatarUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import {
  GlobeAltIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { es } from "date-fns/locale";
import Link from "next/link";

function PatientDetails({ patient }: { patient: Patient }) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy, HH:mm", {
        locale: es,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-grey-900/50 flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-900/30 text-purple-600">
            <GlobeAltIcon className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-grey-300 truncate text-xs font-medium">
              Sitio Web
            </span>
            {patient.website ? (
              <Link
                href={patient.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-semibold text-white hover:cursor-pointer hover:text-purple-400 hover:underline"
                title={patient.website}
              >
                {patient.website}
              </Link>
            ) : (
              <span className="text-grey-500 text-sm font-semibold">N/A</span>
            )}
          </div>
        </div>

        <div className="bg-grey-900/50 flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-900/30 text-green-700">
            <PhoneIcon className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-grey-300 truncate text-xs font-medium">
              Teléfono
            </span>
            {patient.phone ? (
              <Link
                href={`tel:${patient.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-semibold text-white hover:cursor-pointer hover:underline"
                title={patient.phone}
              >
                {patient.phone}
              </Link>
            ) : (
              <span
                className="truncate text-sm font-semibold text-white"
                title="No registrado"
              >
                No registrado
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-grey-700 text-grey-500 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 text-xs">
        {patient.createdAt && (
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="text-grey-500 h-4 w-4" />
            <span>Registrado: {formatDate(patient.createdAt)}</span>
          </div>
        )}

        {patient.updatedAt && (
          <div className="flex items-center gap-2">
            <UserIcon className="text-grey-500 h-4 w-4" />
            <span>Actualizado: {formatDate(patient.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const PatientCard = memo(function PatientCard({
  patient,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onEdit,
}: {
  patient: Patient;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit?: (patient: Patient) => void;
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpand =
    onToggleExpand || (() => setInternalExpanded((prev) => !prev));

  const patientImage = generateAvatarUrl(patient.id);

  return (
    <div
      className={cn(
        "group bg-grey-700/50 relative overflow-hidden rounded-3xl border-2 transition-all duration-200",
        {
          "border-transparent shadow-md hover:-translate-y-1 hover:shadow-xl":
            !isExpanded,
          "z-10 scale-[1.05] border-green-600 shadow-xl": isExpanded,
        },
      )}
    >
      <div
        className={cn(
          "absolute top-0 -left-[2px] h-full transition-all duration-200",
          {
            "w-0.5 bg-green-600": isExpanded,
            "w-1.5 bg-green-700": !isExpanded,
          },
        )}
      />

      <div className="p-6 pl-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex w-full items-start gap-4 sm:w-auto sm:flex-1">
            <div className="relative h-16 w-16 flex-shrink-0">
              <div className="absolute inset-0 rotate-3 rounded-2xl bg-purple-900/30 transition-transform group-hover:rotate-6" />
              <Image
                src={patientImage}
                alt={`Avatar de ${patient.name}`}
                fill
                className="relative rounded-2xl object-cover shadow-sm"
                sizes="64px"
              />
            </div>

            <div className="min-w-0 pt-1">
              <p className="truncate text-xl font-bold text-white">
                {patient.name}
              </p>
              <div className="mt-1 flex flex-col gap-0.5">
                {patient.website && (
                  <Link
                    href={patient.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-grey-300 truncate text-sm font-medium transition-colors hover:cursor-pointer hover:text-purple-400 hover:underline"
                  >
                    {patient.website}
                  </Link>
                )}
                <p className="text-xs font-bold tracking-wider text-green-700 uppercase">
                  ID:{" "}
                  <span className="font-mono">{patient.id.slice(0, 8)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            {onEdit && (
              <Button
                onPress={() => {
                  onEdit(patient);
                }}
                className="bg-grey-700 text-grey-300 hover:bg-grey-900 flex w-full items-center justify-center rounded-xl p-3 transition-colors hover:cursor-pointer sm:w-auto sm:p-2"
                aria-label="Editar"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            )}
            <Button
              onPress={toggleExpand}
              className={cn(
                "flex w-full items-center justify-center rounded-xl p-3 transition-colors hover:cursor-pointer sm:w-auto sm:p-2",
                {
                  "bg-grey-900 text-grey-300": isExpanded,
                  "bg-grey-700 text-grey-300 hover:bg-grey-900": !isExpanded,
                },
              )}
              aria-label={isExpanded ? "Colapsar" : "Expandir"}
            >
              <ChevronDownIcon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isExpanded && "rotate-180",
                )}
              />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn("grid transition-all duration-200 ease-in-out", {
          "grid-rows-[1fr] px-6 pb-6 pl-8 opacity-100": isExpanded,
          "grid-rows-[0fr] px-6 pl-8 opacity-0": !isExpanded,
        })}
      >
        <div className="overflow-hidden">
          <div className="bg-grey-700 mb-4 h-px w-full" />
          <PatientDetails patient={patient} />
        </div>
      </div>
    </div>
  );
});
