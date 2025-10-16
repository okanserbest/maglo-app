const ACCESS_TOKEN_KEY = 'maglo.accessToken';

let memoryToken: string | null = null;

export const token = {
  get() {
    return memoryToken ?? localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(value: string | null) {
    memoryToken = value;
    if (value) localStorage.setItem(ACCESS_TOKEN_KEY, value);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  clear() {
    this.set(null);
  },
};
