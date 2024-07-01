// src/utils/whatsapp.ts

import React from "react";
import { Linking } from "react-native";


const handleWhatsAppPress = async (phoneNumber: string) => {
  const url = `https://wa.me/${phoneNumber}`;
  await Linking.openURL(url);
  console.log("Enviando whatsapp");
};

export default handleWhatsAppPress;