import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  createEvent,
  deleteEvent,
  getEvents,
  replaceEvent,
  updateEvent
} from './src/api';
import type { EventStatus, FestivalEvent } from './types';

export default function App() {
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [selectedId, setSelectedId] = useState('EVT-101');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState('');

  const loadEvents = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      setEvents(await getEvents());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las actuaciones');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const run = async (label: string, operation: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      const response = await operation();
      setResult(`${label}\n${JSON.stringify(response, null, 2)}`);
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : 'La operación no se completó');
    } finally {
      setBusy(false);
    }
  };

  const selectedEvent = events.find((event) => event.id === selectedId);
  const nextStatus: EventStatus = selectedEvent?.status === 'CANCELLED' ? 'CONFIRMED' : 'CANCELLED';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>FESTIVAL CONTROL · API SERVERLESS</Text>
        <Text style={styles.title}>Actuaciones</Text>
        <Text style={styles.subtitle}>Festival Control · cliente Expo + TypeScript</Text>

        <View style={styles.toolbar}>
          <Text style={styles.sectionTitle}>Catálogo del servidor</Text>
          <ActionButton label="Recargar GET" disabled={busy} onPress={() => void loadEvents()} />
        </View>

        {busy && <ActivityIndicator color="#f4b942" style={styles.loading} />}
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

        {events.map((event) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedId === event.id }}
            key={event.id}
            onPress={() => setSelectedId(event.id)}
            style={[styles.card, selectedId === event.id && styles.selectedCard]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.artist}>{event.artist}</Text>
              <Text style={[styles.status, event.status === 'CANCELLED' && styles.cancelled]}>
                {event.status}
              </Text>
            </View>
            <Text style={styles.detail}>{event.id} · {event.space}</Text>
            <Text style={styles.detail}>{event.time}</Text>
          </Pressable>
        ))}

        <Text style={styles.selection}>Selección: {selectedId}</Text>

        <Text style={styles.sectionTitle}>Operaciones simuladas</Text>
        <Text style={styles.note}>
          El servidor devuelve cada resultado, pero no modifica el catálogo fijo.
        </Text>
        <View style={styles.actions}>
          <ActionButton
            label="Crear actuación"
            disabled={busy}
            onPress={() => void run('POST /events', () => createEvent({
              artist: 'Nova Pulse',
              space: 'Main Stage',
              time: '21:00',
              status: 'CONFIRMED'
            }))}
          />
          <ActionButton
            label="Sustituir EVT-101"
            disabled={busy}
            onPress={() => void run('PUT /events/EVT-101', () => replaceEvent('EVT-101', {
              artist: 'Nova Pulse',
              space: 'Main Stage',
              time: '21:00',
              status: 'CONFIRMED'
            }))}
          />
          <ActionButton
            label={`Cambiar a ${nextStatus}`}
            disabled={busy || !selectedEvent}
            onPress={() => void run(`PATCH /events/${selectedId}`, () => updateEvent(selectedId, nextStatus))}
          />
          <ActionButton
            label="Eliminar EVT-102"
            disabled={busy}
            onPress={() => void run('DELETE /events/EVT-102', () => deleteEvent('EVT-102'))}
          />
        </View>

        {result !== '' && (
          <View style={styles.resultCard}>
            <Text style={styles.sectionTitle}>Respuesta del servidor</Text>
            <Text selectable style={styles.result}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ActionButton({
  label,
  disabled,
  onPress
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#10151d' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, paddingTop: 48 },
  eyebrow: { color: '#f4b942', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#ffffff', fontSize: 34, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#aab4c3', fontSize: 15, marginBottom: 28, marginTop: 6 },
  toolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#ffffff', fontSize: 19, fontWeight: '700', marginBottom: 12, marginTop: 14 },
  loading: { marginVertical: 16 },
  error: { backgroundColor: '#451e27', borderRadius: 8, color: '#ffd7df', marginVertical: 12, padding: 12 },
  card: { backgroundColor: '#1b2430', borderColor: '#303c4c', borderRadius: 12, borderWidth: 1, marginBottom: 10, padding: 16 },
  selectedCard: { borderColor: '#f4b942' },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  artist: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  status: { color: '#91dfb1', fontSize: 11, fontWeight: '800' },
  cancelled: { color: '#ff9ca8' },
  detail: { color: '#aab4c3', marginTop: 6 },
  selection: { color: '#f4b942', fontWeight: '700', marginVertical: 12 },
  note: { color: '#aab4c3', lineHeight: 21, marginBottom: 12 },
  actions: { gap: 8 },
  button: { alignItems: 'center', backgroundColor: '#f4b942', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#10151d', fontWeight: '800' },
  resultCard: { backgroundColor: '#1b2430', borderRadius: 12, marginTop: 24, padding: 16 },
  result: { color: '#d3dbe6', fontFamily: 'monospace', fontSize: 12, lineHeight: 18 }
});
