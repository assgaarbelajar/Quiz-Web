const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  const parsed = users ? JSON.parse(users) : {};
  if (Array.isArray(parsed)) {
    const migrated = {};
    parsed.forEach((name) => {
      if (name && !migrated[name]) {
        migrated[name] = { password: "" };
      }
    });
    return migrated;
  }
  return parsed;
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isValidPassword(password) {
  const clean = (password || "").trim();
  return /^[a-z0-9]+$/i.test(clean) && clean.length >= 6;
}

export function signup(username, password) {
  const users = getUsers();
  const cleanUser = (username || "").trim();
  const cleanPass = (password || "").trim();

  if (!cleanUser) {
    return { success: false, message: "Username required" };
  }

  if (!isValidPassword(cleanPass)) {
    return {
      success: false,
      message: "Password must be alphanumeric and at least 6 characters",
    };
  }

  if (users[cleanUser]) {
    return { success: false, message: "User already exists" };
  }

  users[cleanUser] = {
    password: cleanPass,
  };
  setUsers(users);

  localStorage.setItem(CURRENT_USER_KEY, cleanUser);

  return { success: true };
}

export function login(username, password) {
  const users = getUsers();
  const cleanUser = (username || "").trim();
  const cleanPass = (password || "").trim();

  if (!cleanUser) {
    return { success: false, message: "Username required" };
  }

  if (!cleanPass) {
    return { success: false, message: "Password required" };
  }

  const user = users[cleanUser];
  if (!user || user.password !== cleanPass) {
    return { success: false, message: "Invalid username or password" };
  }

  localStorage.setItem(CURRENT_USER_KEY, cleanUser);
  return { success: true };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}
