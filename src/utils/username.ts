/**
 * Generates a unique username from an email address
 * @param email The email address to convert
 * @returns A username in the format: localpart-xxxxx
 */
export const generateUsername = (email: string): string => {
  // Get the part before @ and remove any special characters
  const localPart = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Generate a random 5 character string
  const uniqueString = Math.random().toString(36).substring(2, 7);
  
  return `${localPart}-${uniqueString}`;
};