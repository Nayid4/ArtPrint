// controllers/WhatsAppController.ts

import { Firestore, getDoc, doc, setDoc, updateDoc, DocumentData, CollectionReference, collection } from 'firebase/firestore';
import { WhatsApp } from '../domain/entities/WhatsApp';
import { db } from '../config/firebaseConfig';

class WhatsAppController {
  private db: Firestore;
  private whatsappDocRef: CollectionReference<DocumentData>;

  constructor() {
    this.db = db;
    this.whatsappDocRef = collection(this.db, 'config');
  }

  private async obtenerDocumentoWhatsApp(): Promise<DocumentData | null> {
    try {
      const docRef = doc(this.whatsappDocRef, 'whatsapp');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error al obtener documento de WhatsApp:', error);
      throw error;
    }
  }

  async obtenerNumeroWhatsAppPorIdDefault(): Promise<WhatsApp | null> {
    try {
      const docRef = doc(this.whatsappDocRef, 'whatsapp');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: 'default',
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener número de WhatsApp por ID default:', error);
      throw error;
    }
  }

  async guardarNumeroWhatsApp(numero: string, countryCode: string): Promise<void> {
    try {
      const docData = await this.obtenerDocumentoWhatsApp();
      if (!docData) {
        await this.crearDocumentoWhatsApp(numero, countryCode);
      } else {
        console.log('El documento de WhatsApp ya existe. Actualizando...');
        await this.actualizarNumeroWhatsApp(numero, countryCode);
      }
    } catch (error) {
      console.error('Error al guardar número de WhatsApp:', error);
      throw error;
    }
  }

  private async crearDocumentoWhatsApp(numero: string, countryCode: string): Promise<void> {
    try {
      const whatsappData: WhatsApp = { id: 'default', phoneNumber: numero, countryCode };
      const docRef = doc(this.whatsappDocRef, 'whatsapp');
      await setDoc(docRef, whatsappData);
    } catch (error) {
      console.error('Error al crear documento de WhatsApp:', error);
      throw error;
    }
  }

  async obtenerNumeroWhatsApp(): Promise<WhatsApp | null> {
    try {
      const docData = await this.obtenerDocumentoWhatsApp();
      return docData ? (docData as WhatsApp) : null;
    } catch (error) {
      console.error('Error al obtener número de WhatsApp:', error);
      throw error;
    }
  }

  async actualizarNumeroWhatsApp(numero: string, countryCode: string): Promise<void> {
    try {
      const docRef = doc(this.whatsappDocRef, 'whatsapp');
      const whatsappData: WhatsApp = { id: 'default', phoneNumber: numero, countryCode };
      await updateDoc(docRef, whatsappData);
    } catch (error) {
      console.error('Error al actualizar número de WhatsApp:', error);
      throw error;
    }
  }
}

export default WhatsAppController;
