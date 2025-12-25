import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect directly to login/add page
  redirect('/admin/realizacje/dodaj');
}
