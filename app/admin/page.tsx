import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to admin management dashboard
  redirect('/admin/realizacje');
}
