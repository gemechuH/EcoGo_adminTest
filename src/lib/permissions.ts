export const ROLE_PERMISSIONS = {
  super_admin: {
    users: { create: true, read: true, update: true, delete: true },
    vehicles: {
      create: true,
      read: true,
      update: true,
      delete: true,
      approve: true,
    },
  },

  admin: {
    users: { create: true, read: true, update: true, delete: false },
    vehicles: {
      create: true,
      read: true,
      update: true,
      delete: false,
      approve: false,
    },
  },

  hr: {
    users: { create: true, read: true, update: true, delete: false },
    vehicles: {
      create: false,
      read: true,
      update: false,
      delete: false,
      approve: true,
    },
  },

  it_support: {
    users: { create: false, read: true, update: true, delete: false },
    vehicles: {
      create: false,
      read: true,
      update: false,
      delete: false,
      approve: false,
    },
  },

  driver: {
    users: { create: false, read: false, update: false, delete: false },
    vehicles: {
      create: true,
      read: true,
      update: false,
      delete: false,
      approve: false,
    },
  },

  rider: {
    users: { create: false, read: false, update: false, delete: false },
    vehicles: {
      create: false,
      read: false,
      update: false,
      delete: false,
      approve: false,
    },
  },

  finance: {
    users: { create: false, read: true, update: false, delete: false },
    vehicles: {
      create: false,
      read: true,
      update: false,
      delete: false,
      approve: false,
    },
  },
};
