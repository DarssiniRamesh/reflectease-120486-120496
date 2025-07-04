//
// Clerk integration: JWT storage and custom login/register are no longer used.
//
// This file only provides deprecated stubs for compatibility.
// Please migrate to Clerk's useUser/useSession and UI components.
//

/**
 * JWT-based authentication is now replaced by Clerk.
 * Remove all uses of setToken, getToken, login, register, isLoggedIn.
 * Use Clerk hooks (useUser, useSession) for authentication status and details.
 * See: https://clerk.com/docs/component-reference
 */

// PUBLIC_INTERFACE
export function setToken(token) {
  // Deprecated: Use Clerk for token management.
  return undefined;
}

// PUBLIC_INTERFACE
export function getToken() {
  // Deprecated: Use Clerk for authentication.
  return undefined;
}

// PUBLIC_INTERFACE
export function clearToken() {
  // Deprecated: Use Clerk for authentication.
  return undefined;
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  // Deprecated: Use Clerk's <SignIn /> component.
  throw new Error(
    "login() is deprecated. Use Clerk <SignIn /> component instead."
  );
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  // Deprecated: Use Clerk's <SignUp /> component.
  throw new Error(
    "register() is deprecated. Use Clerk <SignUp /> component instead."
  );
}

// PUBLIC_INTERFACE
export function isLoggedIn() {
  // Deprecated: Use Clerk's useUser/useSession hook.
  return false;
}
