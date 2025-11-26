export const ROLE_PERMISSIONS = {
  super_admin: {
    users: { create: true, read: true, update: true, delete: true },
  },

  admin: {
    users: { create: true, read: true, update: true, delete: false },
  },

  hr: {
    users: { create: true, read: true, update: true, delete: false },
  },

  it_support: {
    users: { create: false, read: true, update: true, delete: false },
  },

  driver: {
    users: { create: false, read: false, update: false, delete: false },
  },

  rider: {
    users: { create: false, read: false, update: false, delete: false },
  },

  finance: {
    users: { create: false, read: true, update: false, delete: false },
  },
};
