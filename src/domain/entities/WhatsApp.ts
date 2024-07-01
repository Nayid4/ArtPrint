// src/domain/entities/WhatsApp.ts

type WhatsApp = {
  id: string;
  phoneNumber: string;
  countryCode: string;
};

const createWhatsApp = (id: string, phoneNumber: string, countryCode: string): WhatsApp => ({
  id,
  phoneNumber,
  countryCode,
});

export { WhatsApp, createWhatsApp };
