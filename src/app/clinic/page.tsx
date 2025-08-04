import AppHeader from '@/components/app-header';
import PatientManagement from '@/components/patient-management';

export default function ClinicPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">
        <PatientManagement />
      </main>
    </div>
  );
}
