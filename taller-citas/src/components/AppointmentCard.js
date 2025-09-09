import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDateTime } from '../utils/date';

export default function AppointmentCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.customerName}</Text>
      <Text style={styles.sub}>{item.vehicleModel}</Text>
      <Text style={styles.date}>{formatDateTime(item.dateTimeISO)}</Text>
      {item.description ? (
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.primary]} onPress={onEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.danger]} onPress={onDelete}>
          <Text style={styles.btnText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,                
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#2f2f2f',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 14, color: '#cfcfcf' },
  date: { fontSize: 13, color: '#9ad' },
  desc: { fontSize: 13, color: '#ccc', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  primary: { backgroundColor: '#2563eb' },
  danger: { backgroundColor: '#dc2626' },
  btnText: { color: 'white', fontWeight: '700' },
});
