export const mockPayments = [
  {
    id: 'pay1',
    leaseId: 'l1',
    tenantId: '3',
    amount: 95000,
    dueDate: '2024-11-01',
    paidDate: '2024-11-02',
    status: 'completed',
    paymentId: 'razorpay_12345',
    receiptUrl: 'https://example.com/receipt-1.pdf',
  },
  {
    id: 'pay2',
    leaseId: 'l1',
    tenantId: '3',
    amount: 95000,
    dueDate: '2024-12-01',
    paidDate: null,
    status: 'pending',
    paymentId: null,
    receiptUrl: null,
  },
];
