import { Specialty, Role, AppointmentStatus } from "@prisma/client";

export function translateSpecialty(value: Specialty): string {
  switch (value) {
    case Specialty.GYNECOLOGIST:
      return "Ginecologista (Pré-Concepção)";
    case Specialty.OBSTETRICIAN:
      return "Obstetra";
    case Specialty.PEDIATRICIAN:
      return "Pediatra";
    default:
      return value;
  }
}

export function SpecialtySelect() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Especialidade
      </label>
      <select
        name="specialty"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {Object.values(Specialty).map((value) => (
          <option key={value} value={value}>
            {translateSpecialty(value)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function translateRole(value: Role): string {
  switch (value) {
    case Role.PATIENT:
      return "Paciente";
    case Role.PROFESSIONAL:
      return "Profissional";
    case Role.ADMIN:
      return "Administrador";
    default:
      return value;
  }
}

export function RoleSelect() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Usuário
      </label>
      <select
        name="role"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {Object.values(Role).map((value) => (
          <option key={value} value={value}>
            {translateRole(value)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function translateStatus(value: AppointmentStatus): string {
  switch (value) {
    case AppointmentStatus.PENDING:
      return "Pendente";
    case AppointmentStatus.CONFIRMED:
      return "Confirmado";
    case AppointmentStatus.CANCELED:
      return "Cancelado";
    case AppointmentStatus.COMPLETED:
      return "Concluído";
    default:
      return value;
  }
}

export function AppointmentStatusSelect() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Status da Consulta
      </label>
      <select
        name="status"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {Object.values(AppointmentStatus).map((value) => (
          <option key={value} value={value}>
            {translateStatus(value)}
          </option>
        ))}
      </select>
    </div>
  );
}