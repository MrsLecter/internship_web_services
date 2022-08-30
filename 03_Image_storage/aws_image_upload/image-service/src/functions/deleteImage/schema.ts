export default {
    type: "object",
    properties: {
      name: { type: 'string' }
    },
    required: ['email', 'password']
  } as const;