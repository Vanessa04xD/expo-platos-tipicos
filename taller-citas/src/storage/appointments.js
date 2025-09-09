import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'APPTS_v1';

export async function getAppointments() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setAppointments(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}


export function isDuplicate(list, { dateTimeISO, vehicleModel }, excludeId = null) {
  const v = (vehicleModel || '').trim().toLowerCase();
  return list.some((a) => {
    if (excludeId && a.id === excludeId) return false;
    const sameVehicle = (a.vehicleModel || '').trim().toLowerCase() === v;
    return sameVehicle && a.dateTimeISO === dateTimeISO;
  });
}

export async function addAppointment(appt) {
  const list = await getAppointments();
  if (isDuplicate(list, appt)) {
    const err = new Error('DUPLICATE');
    err.code = 'DUPLICATE';
    throw err;
  }
  const next = [appt, ...list];
  await setAppointments(next);
  return appt;
}

export async function updateAppointment(id, patch) {
  const list = await getAppointments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  const updated = { ...list[idx], ...patch };

  if (isDuplicate(list, updated, id)) {
    const err = new Error('DUPLICATE');
    err.code = 'DUPLICATE';
    throw err;
  }

  const next = [...list];
  next[idx] = updated;
  await setAppointments(next);
  return updated;
}

export async function deleteAppointment(id) {
  const list = await getAppointments();
  const next = list.filter((a) => a.id !== id);
  await setAppointments(next);
  return true;
}
