import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
    Alert, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import AppointmentCard from '../components/AppointmentCard';
import { deleteAppointment, getAppointments } from '../storage/appointments';

export default function HomeScreen() {
  const nav = useNavigation();
  const { width, height } = useWindowDimensions();

  const numColumns = width > height ? 2 : 1;

  const [list, setList] = useState([]);

  const load = async () => {
    const items = await getAppointments();
    setList(items);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const confirmDelete = (id) => {
    Alert.alert(
      'Eliminar cita',
      '¿Seguro que deseas eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteAppointment(id);
            await load();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const columnWrapperStyle = useMemo(
    () => (numColumns > 1 ? styles.rowWrap : undefined),
    [numColumns]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Citas del Taller</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => nav.navigate('AddAppointment')}
        >
          <Text style={styles.addText}>+ Agregar</Text>
        </Pressable>
      </View>

      {list.length === 0 ? (
        <Text style={styles.empty}>No se han encontrado citas... Agenda una cita.</Text>
      ) : (
        <FlatList
          data={list}
          key={numColumns}               
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={columnWrapperStyle}
          renderItem={({ item }) => (
            <View style={[styles.cardWrap, numColumns > 1 && styles.cardWrapHalf]}>
              <AppointmentCard
                item={item}
                onEdit={() => nav.navigate('EditAppointment', { id: item.id })}
                onDelete={() => confirmDelete(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  h1: { color: 'white', fontSize: 22, fontWeight: '800', flex: 1 },
  addBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: { color: '#06210f', fontWeight: '800' },
  empty: { color: '#bbb', textAlign: 'center', marginTop: 40 },
  list: { padding: 8, paddingBottom: 40 },
  rowWrap: { gap: 12 },
  cardWrap: { flex: 1, marginBottom: 12 },
  cardWrapHalf: { minWidth: '48%' },
});
