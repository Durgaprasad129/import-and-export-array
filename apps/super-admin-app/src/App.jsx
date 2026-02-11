import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

const APP_ROLE = 'super_admin';

const LoginPage = () => {
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { email: form.get('email'), password: form.get('password') };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || data.user?.role !== APP_ROLE) {
      window.alert('Invalid credentials for this app role');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    navigate('/dashboard');
  };

  return (
    <main className="mx-auto mt-16 max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">{APP_ROLE} login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" className="w-full rounded border p-2" placeholder="Email" />
        <input name="password" type="password" className="w-full rounded border p-2" placeholder="Password" />
        <button className="w-full rounded bg-slate-900 p-2 text-white">Sign in</button>
      </form>
    </main>
  );
};

const Dashboard = () => {
  const role = localStorage.getItem('role');
  if (role !== APP_ROLE) return <Navigate to="/login" replace />;

  return (
    <main className="mx-auto mt-12 max-w-2xl rounded bg-white p-6 shadow">
      <h2 className="text-2xl font-bold">{APP_ROLE} dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">
        Minimal role-scoped shell wired to shared backend APIs. Extend pages per MVP feature list.
      </p>
      <button
        className="mt-6 rounded bg-rose-600 px-4 py-2 text-white"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
      >
        Logout
      </button>
    </main>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
