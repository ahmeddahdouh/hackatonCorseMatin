// Service d'authentification avec vérification JSON
const USERS_FILE_PATH = '/data/users.json';

// Cache des utilisateurs chargés depuis le JSON
let usersCache = null;

/**
 * Charger les utilisateurs depuis le fichier JSON
 */
export const loadUsersFromJSON = async () => {
  if (usersCache) {
    return usersCache;
  }

  try {
    const response = await fetch(USERS_FILE_PATH);
    if (!response.ok) {
      throw new Error('Impossible de charger les utilisateurs');
    }
    const data = await response.json();
    usersCache = data.users || [];
    return usersCache;
  } catch (error) {
    console.error('Erreur chargement users.json:', error);
    // Retourner les utilisateurs du localStorage en fallback
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  }
};

/**
 * Vérifier les identifiants d'un utilisateur
 */
export const verifyCredentials = async (email, password) => {
  const users = await loadUsersFromJSON();
  
  // Chercher dans les utilisateurs du fichier JSON
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    // Retourner les données sans le mot de passe
    const { password: _, ...userData } = user;
    return { success: true, user: userData };
  }
  
  // Chercher aussi dans les utilisateurs enregistrés localement
  const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const localUser = localUsers.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (localUser) {
    return {
      success: true,
      user: {
        id: localUser.id || Math.random().toString(36).substr(2, 9),
        email: localUser.email,
        name: localUser.name || localUser.email.split('@')[0],
        role: 'user',
        matricule: localUser.matricule || 'N/A',
        createdAt: localUser.createdAt || new Date().toISOString(),
      }
    };
  }
  
  return { success: false, error: 'Email ou mot de passe incorrect' };
};

/**
 * Vérifier si un email existe déjà
 */
export const emailExists = async (email) => {
  const users = await loadUsersFromJSON();
  const existsInJSON = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existsInJSON) return true;
  
  // Vérifier aussi dans les utilisateurs locaux
  const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  return localUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * Enregistrer un nouvel utilisateur (localStorage car pas de backend)
 */
export const registerUser = async (email, password, name = null) => {
  // Vérifier si l'email existe déjà
  const exists = await emailExists(email);
  if (exists) {
    return { success: false, error: 'Cet email est déjà utilisé' };
  }
  
  // Créer le nouvel utilisateur
  const newUser = {
    id: 'local_' + Math.random().toString(36).substr(2, 9),
    email,
    password, // En production, il faudrait hasher le mot de passe
    name: name || email.split('@')[0],
    role: 'user',
    matricule: 'CM-USR-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  
  // Sauvegarder dans localStorage
  const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  localUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
  
  // Retourner les données sans le mot de passe
  const { password: _, ...userData } = newUser;
  return { success: true, user: userData };
};

/**
 * Obtenir tous les utilisateurs (pour admin)
 */
export const getAllUsers = async () => {
  const jsonUsers = await loadUsersFromJSON();
  const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // Combiner et retirer les mots de passe
  const allUsers = [...jsonUsers, ...localUsers].map(({ password, ...user }) => user);
  return allUsers;
};

/**
 * Rafraîchir le cache des utilisateurs
 */
export const refreshUsersCache = () => {
  usersCache = null;
};
