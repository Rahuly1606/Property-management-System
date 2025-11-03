import { http, HttpResponse } from 'msw';
import { mockUsers } from './data/users';
import { mockProperties } from './data/properties';
import { mockLeases } from './data/leases';
import { mockPayments } from './data/payments';
import { mockMaintenance } from './data/maintenance';
import { mockMessages } from './data/messages';
import { mockPurchases } from './data/purchases';

const API_BASE = 'http://localhost:3000/api';

// Simple in-memory storage (resets on page refresh)
let properties = [...mockProperties];
let leases = [...mockLeases];
let payments = [...mockPayments];
let maintenanceRequests = [...mockMaintenance];
let messages = [...mockMessages];
let purchases = [...mockPurchases];

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    const user = mockUsers.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { password, ...userWithoutPassword } = user;
    return HttpResponse.json({
      user: userWithoutPassword,
      token: `mock_token_${user.id}_${Date.now()}`,
    });
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = await request.json() as any;
    const existingUser = mockUsers.find((u) => u.email === body.email);

    if (existingUser) {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `${mockUsers.length + 1}`,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'tenant',
    };

    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;

    return HttpResponse.json({
      user: userWithoutPassword,
      token: `mock_token_${newUser.id}_${Date.now()}`,
    });
  }),

  // Properties endpoints
  http.get(`${API_BASE}/properties`, ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const status = url.searchParams.get('status');

    let filtered = properties;
    if (city) filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
    if (status) filtered = filtered.filter(p => p.status === status);

    return HttpResponse.json(filtered);
  }),

  http.get(`${API_BASE}/properties/:id`, ({ params }) => {
    const property = properties.find(p => p.id === params.id);
    if (!property) {
      return HttpResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    return HttpResponse.json(property);
  }),

  http.post(`${API_BASE}/properties`, async ({ request }) => {
    const body = await request.json() as any;
    const newProperty = {
      ...body,
      id: `p${properties.length + 1}`,
    };
    properties.push(newProperty);
    return HttpResponse.json(newProperty, { status: 201 });
  }),

  http.put(`${API_BASE}/properties/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const index = properties.findIndex(p => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    properties[index] = { ...properties[index], ...body };
    return HttpResponse.json(properties[index]);
  }),

  http.delete(`${API_BASE}/properties/:id`, ({ params }) => {
    const index = properties.findIndex(p => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Property not found' }, { status: 404 });
    }
    properties.splice(index, 1);
    return HttpResponse.json({ message: 'Property deleted' });
  }),

  // Leases endpoints
  http.get(`${API_BASE}/leases`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      return HttpResponse.json(
        leases.filter(l => l.tenantId === userId || l.landlordId === userId)
      );
    }
    return HttpResponse.json(leases);
  }),

  http.post(`${API_BASE}/leases`, async ({ request }) => {
    const body = await request.json() as any;
    const newLease = {
      ...body,
      id: `l${leases.length + 1}`,
      status: 'pending',
    };
    leases.push(newLease);
    return HttpResponse.json(newLease, { status: 201 });
  }),

  http.put(`${API_BASE}/leases/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const index = leases.findIndex(l => l.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Lease not found' }, { status: 404 });
    }
    leases[index] = { ...leases[index], ...body };
    return HttpResponse.json(leases[index]);
  }),

  // Payments endpoints
  http.get(`${API_BASE}/payments`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      return HttpResponse.json(payments.filter(p => p.tenantId === userId));
    }
    return HttpResponse.json(payments);
  }),

  http.post(`${API_BASE}/payments`, async ({ request }) => {
    const body = await request.json() as any;
    const newPayment = {
      ...body,
      id: `pay${payments.length + 1}`,
      status: 'completed',
      paymentId: `razorpay_mock_${Date.now()}`,
      receiptUrl: `https://example.com/receipt-${Date.now()}.pdf`,
    };
    payments.push(newPayment);
    return HttpResponse.json(newPayment, { status: 201 });
  }),

  // Maintenance endpoints
  http.get(`${API_BASE}/maintenance-requests`, ({ request }) => {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const landlordId = url.searchParams.get('landlordId');

    let filtered = maintenanceRequests;
    if (tenantId) filtered = filtered.filter(m => m.tenantId === tenantId);
    if (landlordId) filtered = filtered.filter(m => m.landlordId === landlordId);

    return HttpResponse.json(filtered);
  }),

  http.post(`${API_BASE}/maintenance-requests`, async ({ request }) => {
    const body = await request.json() as any;
    const newRequest = {
      ...body,
      id: `m${maintenanceRequests.length + 1}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    maintenanceRequests.push(newRequest);
    return HttpResponse.json(newRequest, { status: 201 });
  }),

  http.put(`${API_BASE}/maintenance-requests/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const index = maintenanceRequests.findIndex(m => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Request not found' }, { status: 404 });
    }
    maintenanceRequests[index] = {
      ...maintenanceRequests[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(maintenanceRequests[index]);
  }),

  // Messages endpoints
  http.get(`${API_BASE}/messages`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      return HttpResponse.json(
        messages.filter(m => m.senderId === userId || m.receiverId === userId)
      );
    }
    return HttpResponse.json(messages);
  }),

  http.post(`${API_BASE}/messages`, async ({ request }) => {
    const body = await request.json() as any;
    const newMessage = {
      ...body,
      id: `msg${messages.length + 1}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    messages.push(newMessage);
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  // Property purchase requests endpoints
  http.get(`${API_BASE}/property-purchase-requests`, () => {
    return HttpResponse.json(purchases);
  }),

  http.post(`${API_BASE}/property-purchase-requests`, async ({ request }) => {
    const body = await request.json() as any;
    const newPurchase = {
      ...body,
      id: `pur${purchases.length + 1}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    purchases.push(newPurchase);
    return HttpResponse.json(newPurchase, { status: 201 });
  }),

  http.put(`${API_BASE}/property-purchase-requests/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const index = purchases.findIndex(p => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Purchase not found' }, { status: 404 });
    }
    purchases[index] = {
      ...purchases[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(purchases[index]);
  }),
];
