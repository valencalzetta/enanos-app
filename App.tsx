import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from './src/config';

function EnanoAnimado({ source }: { source: any }) {
  const rotacion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotacion, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(rotacion, { toValue: -1, duration: 200, useNativeDriver: true }),
        Animated.timing(rotacion, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(rotacion, { toValue: -1, duration: 200, useNativeDriver: true }),
        Animated.timing(rotacion, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();
  }, []);

  const rotate = rotacion.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Animated.Image
      source={source}
      style={[styles.foto, { transform: [{ rotate }] }]}
    />
  );
}

const FOTOS = [
  require('./assets/enanos/sabio-blancanieves_w862.webp'),
  require('./assets/enanos/duende_dormilon.webp'),
  require('./assets/enanos/duende_fatty.webp'),
  require('./assets/enanos/duende_shy.webp'),
  require('./assets/enanos/duende_verde.webp'),
];

type Enano = {
  id: number;
  nombre: string;
  edad: number;
};

export default function App() {
  const [enanos, setEnanos] = useState<Enano[]>([]);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cargando, setCargando] = useState(false);

  async function cargarEnanos() {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enanos`);
      const data = await res.json();
      setEnanos(data);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el backend.');
    } finally {
      setCargando(false);
    }
  }

  async function crearEnano() {
    const nombreTrim = nombre.trim();
    const edadNum = parseInt(edad, 10);

    if (!nombreTrim) {
      Alert.alert('Validación', 'El nombre no puede estar vacío.');
      return;
    }
    if (isNaN(edadNum) || edadNum < 0) {
      Alert.alert('Validación', 'Ingresá una edad válida.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/enanos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreTrim, edad: edadNum }),
      });
      if (!res.ok) throw new Error('Error al crear enano');
      setNombre('');
      setEdad('');
      await cargarEnanos();
    } catch {
      Alert.alert('Error', 'No se pudo crear el enano.');
    }
  }

  async function eliminarEnano(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enanos/${id}`, {
        method: 'DELETE',
      });
      // El backend responde 204 No Content — no leer JSON
      if (res.status !== 204 && !res.ok) {
        throw new Error('Error al eliminar');
      }
      await cargarEnanos();
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el enano.');
    }
  }

  useEffect(() => {
    cargarEnanos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Enanos</Text>

      <Image
        source={require('./assets/enanos/foto_enanos.png')}
        style={styles.fotoBanner}
      />

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.btnAgregar} onPress={crearEnano}>
          <Text style={styles.btnAgregarTexto}>+ Agregar enano</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator style={styles.spinner} size="large" />
      ) : (
        <FlatList
          data={enanos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <EnanoAnimado source={FOTOS[item.id % FOTOS.length]} />
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.edad}>{item.edad} años</Text>
              </View>
              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={() => eliminarEnano(item.id)}
              >
                <Text style={styles.btnEliminarTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay enanos aún.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  fotoBanner: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formulario: {
    gap: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  spinner: {
    marginTop: 32,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foto: {
    width: 64,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  info: {
    flex: 1,
    paddingLeft: 16,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  edad: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  btnAgregar: {
    backgroundColor: '#4a7c59',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnAgregarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnEliminar: {
    backgroundColor: '#e53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  btnEliminarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  vacio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 16,
  },
});
