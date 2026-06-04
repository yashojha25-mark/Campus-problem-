import ContactMessage from '../models/ContactMessage.js';

export const createContactMessage = async (userId, contactData) => {
  const contactMessage = await ContactMessage.create({
    user: userId || undefined,
    name: contactData.name,
    email: contactData.email,
    message: contactData.message,
  });

  return contactMessage;
};
