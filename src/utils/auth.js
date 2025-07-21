// In a real app, this would involve API calls, but for now, we'll simulate it.

const ADMIN_USER = {
  id: '1',
  username: 'admin',
  password: 'password123', // Never do this in a real app!
  name: 'Admin User',
};

export const authService = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
          const user = { id: ADMIN_USER.id, username: ADMIN_USER.username, name: ADMIN_USER.name };
          localStorage.setItem('authUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 500); // Simulate network delay
    });
  },

  logout: () => {
    localStorage.removeItem('authUser');
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('authUser'));
    } catch (error) {
      return null;
    }
  },
};
