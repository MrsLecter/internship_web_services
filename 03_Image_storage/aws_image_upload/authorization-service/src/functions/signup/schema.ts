export default {
  type: "object",
  properties: {
    password: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['password', 'email']
} as const;
