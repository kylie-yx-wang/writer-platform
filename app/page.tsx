import { redirect } from 'next/navigation';

export default function HomePage() {
  // This instantly sends anyone who visits the root URL to the dashboard
  redirect('/login');
}