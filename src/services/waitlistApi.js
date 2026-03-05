const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error(`No se pudo conectar con el backend en ${API_BASE_URL}. Verifica que la API esté activa.`);
  }

  if (!response.ok) {
    let detail = 'Error inesperado del servidor.';
    try {
      const body = await response.json();
      detail = body?.detail || body?.message || detail;
    } catch {
      // Se mantiene mensaje fallback cuando el servidor no retorna JSON.
    }

    throw new Error(detail);
  }

  return response.json();
}

export async function submitWaitlistLead(payload) {
  return apiRequest('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resendWaitlistConfirmation(email) {
  return apiRequest('/api/leads/resend-confirmation', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function registerUser(payload) {
  return apiRequest('/api/auth/registro', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchUserProfile(token) {
  return apiRequest('/api/auth/perfil', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchDashboardSummary(token) {
  return apiRequest('/api/dashboard/resumen', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
