import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AuthController from '../../../controllers/AuthController';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { Usuario, RolUsuario } from '../../../domain/entities/Usuario';
import CarritoController from '../../../controllers/CarritoController';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registro'>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

const Registro: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [nombre, setNombre] = useState<string>('');
    const [cedula, setCedula] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [direccion, setDireccion] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const authController = new AuthController();
    const carritoController = new CarritoController();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const validateNombre = (nombre: string) => {
        return nombre.trim().length > 0;
    };

    const validateCedula = (cedula: string) => {
        const cedulaRegex = /^\d{7,10}$/;
        return cedulaRegex.test(cedula);
    };    

    const validateTelefono = (telefono: string) => {
        const telefonoRegex = /^\d{9,10}$/;
        return telefonoRegex.test(telefono);
    };

    const validateDireccion = (direccion: string) => {
        return direccion.trim().length > 0;
    };

    const handleRegister = async () => {
        if (!validateNombre(nombre)) {
            Alert.alert('Error', 'Por favor ingrese un nombre válido.');
            return;
        }
    
        if (!validateCedula(cedula)) {
            Alert.alert('Error', 'Por favor ingrese un N° de Indentifiacion válido de minimo 7 y maximo 10 dígitos.');
            return;
        }
    
        if (!validateTelefono(telefono)) {
            Alert.alert('Error', 'Por favor ingrese un número de teléfono válido de minimo 9 o maximo 10 dígitos.');
            return;
        }
    
        if (!validateDireccion(direccion)) {
            Alert.alert('Error', 'Por favor ingrese una dirección válida.');
            return;
        }
    
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor ingrese un correo electrónico válido.');
            return;
        }
    
        if (!validatePassword(password)) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }
    
        setLoading(true);
        try {
            console.log('Registrando usuario...');
            const uid = await authController.register(email, password, cedula, nombre, telefono, direccion, RolUsuario.CLIENTE);
            console.log('Usuario registrado:', uid);
    
            await carritoController.crearCarrito(uid!);
    
            Alert.alert('Registro Exitoso', 'Tu cuenta ha sido creada exitosamente.', [
                { text: 'OK' }
            ]);
        } catch (err) {
            const error = err as Error;
            if (error.message.includes('auth/email-already-in-use')) {
                Alert.alert('Error de registro', 'El correo electrónico ingresado ya está registrado.');
            } else {
                setError(error.message);
                Alert.alert('Error de registro', error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.Titulo}>
                <Text style={styles.nombre}>Art Print</Text>
            </View>
            {loading ? (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#8B5FBF" />
                    </View>
                )
                :
                (
                  <>
                    <View style={styles.contenido}>
                <Text style={styles.title}>Crear una cuenta</Text>
                <Text style={styles.descripcion}>
                    Regístrate con tu correo para realizar compras
                </Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <TextInput
                    style={styles.input}
                    placeholder="N° de Indentifiacion"
                    value={cedula}
                    onChangeText={setCedula}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dirección"
                    value={direccion}
                    onChangeText={setDireccion}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Crear una cuenta</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}>
                    Al hacer clic en crear cuenta, estás de acuerdo con nuestros Términos de servicio y Política de privacidad
                </Text>

                
            </View>
                  </>
                )
            }
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    Titulo: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 15,
    },
    contenido: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderColor: 'lightgray',
        borderWidth: 0.5,
        borderRadius: 10,
    },
    nombre: {
        color: '#4A4A4A',
        fontSize: 70,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#4A4A4A',
    },
    descripcion: {
        color: '#878787',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: '#fff',
        width: '100%',
        color: '#878787',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: '#8B5FBF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    termsText: {
        marginTop: 10,
        color: '#878787',
        textAlign: 'center',
    },
    loadingOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Registro;
