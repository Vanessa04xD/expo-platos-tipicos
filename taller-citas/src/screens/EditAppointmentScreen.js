import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { getAppointments, updateAppointment } from '../storage/appointments';
import { combineDateTime } from '../utils/date';

export default function EditAppointmentScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  const [ready, setReady] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [description, setDescription] = useState('');

  const [datePart, setDatePart] = useState(new Date());
  const [timePart, setTimePart] = useState(new Date());

  const [showDate, setShowDate] = useState(Platform.OS === 'ios');
  const [showTime, setShowTime] = useState(Platform.OS === 'ios');

  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const list = await getAppointments();
      const appt = list.find((a) => a.id === id);
      if (!appt) {
        setError('Cita no encontrada.');
        return;
      }
      setCustomerName(appt.customerName);
      setVehicleModel(appt.vehicleModel);
      setDescription(appt.description || '');
      const dt = new Date(appt.dateTimeISO);
      setDatePart(dt);
      setTimePart(dt);
      setReady(true);
    })();
  }, [id]);

  const validate = (iso) => {
    setError('');
    const nameOk = customerName.trim().length >= 3;
    if (!nameOk) return 'El nombre debe tener al menos 3 caracteres.';
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return 'Fecha/hora inválida.';
    if (dt <= new Date()) return 'La fecha/hora debe ser posterior al momento actual.';
    if (!vehicleModel.trim()) return 'El modelo del vehículo es requerido.';
    return '';
  };

  const onSubmit = async () => {
    const combined = combineDateTime(datePart, timePart);
    const dateTimeISO = combined.toISOString();
    const err = validate(dateTimeISO);
    if (err) { setError(err); return; }
    try {
      await updateAppointment(id, {
        customerName: customerName.trim(),
        vehicleModel: vehicleModel.trim(),
        description: description.trim(),
        dateTimeISO,
      });
      nav.goBack();
    } catch (e) {
      if (e?.code === 'DUPLICATE') {
        setError('Ya existe una cita con la misma fecha/hora y vehículo.');
      } else {
        setError('Ocurrió un error.');
      }
    }
  };

  if (!ready) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#bbb' }}>Cargando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Editar Cita</Text>

      <Text style={styles.label}>Nombre del cliente</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Ej: Ana Pérez"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Modelo del vehículo</Text>
      <TextInput
        style={styles.input}
        value={vehicleModel}
        onChangeText={setVehicleModel}
        placeholder="Ej: Toyota Corolla 2018"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Fecha de la cita</Text>
      {Platform.OS !== 'ios' && (
        <Pressable style={styles.pickerBtn} onPress={() => setShowDate(true)}>
          <Text style={styles.pickerText}>{datePart.toDateString()}</Text>
        </Pressable>
      )}
      {showDate && (
        <DateTimePicker
          value={datePart}
          mode="date"
          onChange={(e, d) => {
            if (d) setDatePart(d);
            if (Platform.OS !== 'ios') setShowDate(false);
          }}
        />
      )}

      <Text style={styles.label}>Hora de la cita</Text>
      {Platform.OS !== 'ios' && (
        <Pressable style={styles.pickerBtn} onPress={() => setShowTime(true)}>
          <Text style={styles.pickerText}>
            {timePart.toTimeString().slice(0,5)}
          </Text>
        </Pressable>
      )}
      {showTime && (
        <DateTimePicker
          value={timePart}
          mode="time"
          is24Hour
          onChange={(e, d) => {
            if (d) setTimePart(d);
            if (Platform.OS !== 'ios') setShowTime(false);
          }}
        />
      )}

      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe brevemente el problema…"
        placeholderTextColor="#666"
        multiline
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.saveBtn} onPress={onSubmit}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b', padding: 16, paddingTop: 50 },
  h1: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  label: { color: '#ddd', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: '#151515',
    borderColor: '#2f2f2f',
    borderWidth: 1,
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  pickerBtn: {
    backgroundColor: '#151515',
    borderColor: '#2f2f2f',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: { color: 'white' },
  error: { color: '#fda4af', marginTop: 10, fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#2563eb',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: '800', fontSize: 16 },
});
