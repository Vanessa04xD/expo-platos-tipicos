import * as React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- Objeto JSON con platillos ---
const PLATOS = [
  {
    id: "1",
    nombre: "Pupusas",
    descripcion: "Tortillas de maíz rellenas de queso, frijol o chicharrón.",
    foto: "https://www.paulinacocina.net/wp-content/uploads/2023/04/20230410_111551_0002.jpg",
    ingredientes: ["Masa de maíz", "Queso", "Frijoles", "Chicharrón", "Curtido", "Salsa"],
    region: "El Salvador",
    precio: 1.25,
    categoria: "Típico",
  },
  {
    id: "2",
    nombre: "Yuca Frita",
    descripcion: "Yuca crujiente con curtido y salsa.",
    foto: "https://i.ytimg.com/vi/dp6oQ7cekPc/maxresdefault.jpg",
    ingredientes: ["Yuca", "Aceite", "Curtido", "Salsa"],
    region: "Centroamérica",
    precio: 2.5,
    categoria: "Antojito",
  },
  {
    id: "3",
    nombre: "Atol de Elote",
    descripcion: "Bebida dulce y cremosa a base de maíz.",
    foto: "https://www.pcrm.org/sites/default/files/2024-01/atol-elote.jpg",
    ingredientes: ["Elote", "Leche", "Azúcar", "Canela"],
    region: "Mesoamérica",
    precio: 1.75,
    categoria: "Bebida",
  },
  {
  id: "4",
  nombre: "Tamales de Elote",
  descripcion: "Tamales dulces elaborados con maíz, envueltos en hoja de elote.",
  foto: "https://images.aws.nestle.recipes/original/55e6b9eff69fcdcaa6bad9c1ed77be8b_TAMALES_DE_ELOTE_150.jpg",
  ingredientes: ["Maíz", "Azúcar", "Crema", "Hoja de elote"],
  region: "Centroamérica",
  precio: 2.0,
  categoria: "Tradicional"
},
];

// --- Pantalla principal ---
function HomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const numCols = isPortrait ? 1 : 2; // 1 columna vertical, 2 horizontal

  return (
    <View style={styles.container}>
      <FlatList
        data={PLATOS}
        key={numCols}
        numColumns={numCols}
        columnWrapperStyle={numCols > 1 ? { gap: 12 } : null}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Detalles", { plato: item })}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
          >
            <Image source={{ uri: item.foto }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text numberOfLines={2} style={styles.cardDesc}>{item.descripcion}</Text>
              <View style={styles.pillRow}>
                <Text style={styles.pill}>${item.precio.toFixed(2)}</Text>
                <Text style={styles.pill}>{item.categoria}</Text>
                <Text style={styles.pillSmall}>{item.region}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

// --- Pantalla de detalles ---
function DetailsScreen({ route }) {
  const { plato } = route.params;
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: plato.foto }} style={styles.hero} />
      <Text style={styles.title}>{plato.nombre}</Text>
      <Text style={styles.meta}>
        {plato.region} • {plato.categoria} • ${plato.precio.toFixed(2)}
      </Text>
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{plato.descripcion}</Text>
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {plato.ingredientes.map((ing, idx) => (
          <Text key={idx} style={styles.ingredient}>{ing}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Platillos" component={HomeScreen} />
        <Stack.Screen name="Detalles" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 12, gap: 6 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardDesc: { color: "#555" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  pill: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "600",
  },
  pillSmall: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },
  hero: { width: "100%", height: 220, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  meta: { color: "#666", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 10, marginBottom: 6 },
  text: { fontSize: 14, color: "#333" },
  ingredient: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
