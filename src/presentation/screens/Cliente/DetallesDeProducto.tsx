import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import CustomCheckbox from '../../components/CustomCheckBox';
import { Producto } from '../../../domain/entities/producto';
import CarritoController from '../../../controllers/CarritoController';
import useAuthStore from '../../store/authStore';
import ColorController from '../../../controllers/ColorController';
import TallaController from '../../../controllers/TallaController';
import MaterialController from '../../../controllers/MaterialController';
import CategoriaController from '../../../controllers/CategoriaController';
import PrendaController from '../../../controllers/PrendaController';
import { Talla } from '../../../domain/entities/Talla';
import { Color } from '../../../domain/entities/Color';
import { Material } from '../../../domain/entities/Material';
import { Categoria } from '../../../domain/entities/Categoria';
import { Prenda } from '../../../domain/entities/Prenda';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

type DetallesDeProductoRouteProp = RouteProp<RootStackParamList, 'DetallesDeProducto'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  route: DetallesDeProductoRouteProp;
  navigation: NavigationProp;
}

const carritoController = new CarritoController();
const colorController = new ColorController();
const tallaController = new TallaController();
const materialController = new MaterialController();
const categoriaController = new CategoriaController();
const prendaController = new PrendaController();

const DetallesDeProducto: React.FC<Props> = ({ route, navigation }) => {
  const { producto } = route.params;
  const { userInfo } = useAuthStore();
  const usuarioId = userInfo?.id;

  const [tallas, setTallas] = useState<Talla[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [selectedTalla, setSelectedTalla] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedPrenda, setSelectedPrenda] = useState<string>('');
  const [selectedGenero, setSelectedGenero] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [addToCartDisabled, setAddToCartDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tallasData, coloresData, materialesData, categoriasData] = await Promise.all([
          tallaController.obtenerTodasLasTallas(),
          colorController.obtenerTodosLosColores(),
          materialController.obtenerTodosLosMateriales(),
          categoriaController.obtenerTodasLasCategorias(),
        ]);
        setTallas(tallasData);
        setColores(coloresData);
        setMateriales(materialesData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPrendas = async () => {
      if (selectedCategoria) {
        try {
          const prendasData = await prendaController.obtenerPrendasPorCategoria(selectedCategoria);
          setPrendas(prendasData);
          setSelectedPrenda(prendasData.length > 0 ? prendasData[0].id : '');
        } catch (error) {
          console.error('Error al cargar prendas:', error);
        }
      }
    };

    fetchPrendas();
  }, [selectedCategoria]);

  useEffect(() => {
    const allSelectionsMade = [
      selectedTalla,
      selectedColor,
      selectedMaterial,
      selectedCategoria,
      selectedPrenda,
      selectedGenero
    ].every(Boolean);
    setAddToCartDisabled(!allSelectionsMade);
  }, [selectedTalla, selectedColor, selectedMaterial, selectedCategoria, selectedPrenda, selectedGenero]);

  const handleAddToCart = async () => {
    if (!usuarioId) {
      Alert.alert(
        'Usuario no autenticado',
        'Por favor, inicie sesión para agregar productos al carrito.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') },
        ],
        { cancelable: false }
      );
      return;
    }
  
    setIsAddingToCart(true);
  
    try {
      let carrito = await carritoController.obtenerCarritoPorUsuarioId(usuarioId);
  
      if (!carrito) {
        carrito = await carritoController.crearCarrito(usuarioId);
      }
  
      const itemCarrito = {
        productoId: producto.id,
        imagen: producto.imagenUrl,
        nombre: producto.nombre,
        idPrenda: selectedPrenda,
        idMaterial: selectedMaterial,
        idColor: selectedColor,
        talla: selectedTalla,
        genero: selectedGenero,
        cantidad: cantidad,
        precio: producto.precio,
      };
  
      await carritoController.agregarProductoAlCarrito(carrito.id, itemCarrito, usuarioId);
      console.log('Producto agregado al carrito');
  
      Alert.alert(
        'Producto agregado al carrito',
        '',
        [
          { text: 'Ok', },
        ],
        { cancelable: false }
      );
  
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  

  const handleIncrement = () => setCantidad(cantidad + 1);

  const handleDecrement = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
      </View>
    );
  }

  const renderOptions = (title: string, items: any[], selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.selectionGroup}>
        {items.map(item => (
          <CustomCheckbox
            key={item.id}
            label={item.nombre}
            selected={selected === item.id}
            onSelect={() => setSelected(item.id)}
          />
        ))}
      </View>
    </View>
  );

  const renderSimpleOptions = (title: string, items: string[], selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.selectionGroup}>
        {items.map(item => (
          <CustomCheckbox
            key={item}
            label={item}
            selected={selected === item}
            onSelect={() => setSelected(item)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageRow}>
          <Image source={{ uri: producto.imagenUrl }} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.contentInfo}>
            <Text style={styles.productName}>{producto.nombre}</Text>
            <Text style={styles.description}>{producto.descripcion}</Text>
            <Text style={styles.price}>${producto.precio.toFixed(2)}</Text>
          </View>

          {renderOptions('Selecciona la talla', tallas, selectedTalla, setSelectedTalla)}
          {renderOptions('Selecciona el color', colores, selectedColor, setSelectedColor)}
          {renderOptions('Selecciona el material', materiales, selectedMaterial, setSelectedMaterial)}
          {renderOptions('Selecciona la categoría', categorias, selectedCategoria, setSelectedCategoria)}
          {selectedCategoria && renderOptions('Selecciona la prenda', prendas, selectedPrenda, setSelectedPrenda)}
          {renderSimpleOptions('Selecciona el género', ['Hombre', 'Mujer', 'Unisex'], selectedGenero, setSelectedGenero)}

          <Text style={styles.sectionTitle}>Selecciona la cantidad</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{cantidad}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={[styles.addToCartButton, addToCartDisabled && styles.addToCartButtonDisabled]}
            disabled={addToCartDisabled || isAddingToCart} // Deshabilitamos el botón si ya se está agregando al carrito
          >
            {isAddingToCart ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addToCartButtonText}>Agregar al Carrito</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imageRow: {
    justifyContent: 'center',
    backgroundColor: '#f09',
  },
  image: {
    width: 'auto',
    height: 330,
    objectFit: 'cover'
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentInfo: {
    alignItems: 'flex-start',
    margin: 5
  },
  productName: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  quantityButtonText: {
    fontSize: 20,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  addToCartButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#aaa',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
});

export default DetallesDeProducto;