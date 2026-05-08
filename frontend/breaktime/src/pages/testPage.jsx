import { useState } from 'react';
import InboxBookingSlideOut from '../components/inboxSlideOut/InboxSlideOut';

// ── Dummy bookings covering every activity variant ──────────────────────────

const bookings = [
  {
    id: 'b1',
    clientName: 'Jane Doe',
    serviceID: 'laundry',
    bookingID: 'BK-001',
    status: 'confirmed',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'monday', startTime: '09:00', endTime: '10:00' },
    // activity format: [activityType, kind, value?, timestamp?]
    activity: [
      ['update', 'confirmed', null, '2024-10-15T12:45:00'],
    ],
  },
  {
    id: 'b2',
    clientName: 'Marcus Lee',
    serviceID: 'meeting',
    bookingID: 'BK-002',
    status: 'modified',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'tuesday', startTime: '14:00', endTime: '15:30' },
    activity: [
      ['update', 'confirmed', null, '2024-10-14T09:00:00'],
      ['update', 'modified', null, '2024-10-15T12:45:00'],
    ],
  },
  {
    id: 'b3',
    clientName: 'Sara Kim',
    serviceID: 'services',
    bookingID: 'BK-003',
    status: 'canceled',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'wednesday', startTime: '11:00', endTime: '12:00' },
    activity: [
      ['update', 'confirmed', null, '2024-10-13T08:30:00'],
      ['update', 'canceled',  null, '2024-10-15T12:45:00'],
    ],
  },
  {
    id: 'b4',
    clientName: 'Tom Baker',
    serviceID: 'laundry',
    bookingID: 'BK-004',
    status: 'confirmed',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'thursday', startTime: '10:00', endTime: '11:00' },
    activity: [
      ['update', 'confirmed', null, '2024-10-15T10:00:00'],
      ['action', 'time',  '+30 minutes', '2024-10-15T12:45:00', "I'm so sorry I forgot about my detergent so I had to run home to get them"],
    ],
  },
  {
    id: 'b5',
    clientName: 'Priya Patel',
    serviceID: 'meeting',
    bookingID: 'BK-005',
    status: 'pending',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'friday', startTime: '13:00', endTime: '14:00' },
    activity: [
      ['update', 'confirmed', null, '2024-10-15T08:00:00'],
      ['action', 'note', "I'm wondering if I can have two extra chairs for my shower booking because I'm sad", '2024-10-15T12:45:00'],
    ],
  },
  {
    id: 'b6',
    clientName: 'Alex Rivers',
    serviceID: 'services',
    bookingID: 'BK-006',
    status: 'pending',
    timestamp: new Date('2024-10-15T12:45:00'),
    duration: { day: 'saturday', startTime: '15:00', endTime: '16:00' },
    activity: [
      ['update', 'confirmed', null, '2024-10-15T09:00:00'],
      ['action', 'note', "I'm wondering if I can have two extra chairs for my shower booking because I'm sad", '2024-10-15T12:45:00'],
    ],
  },
];

const LABELS = {
  b1: 'confirmed',
  b2: 'modified',
  b3: 'canceled',
  b4: 'extra time',
  b5: 'left note',
  b6: 'general inquiry',
};

export default function TestSlideOutPage() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: '#F9FAFB',
        fontFamily: "'Poppins', sans-serif",
        padding: 32,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
        Inbox Slide-Out Test
      </h1>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
        Click a button to open the booking slide-out with that activity type
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {bookings.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBooking(b)}
            style={{
              background: '#fff',
              border: '1.5px solid #E5E7EB',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.15s',
            }}
          >
            {LABELS[b.id]}
          </button>
        ))}
      </div>

      <InboxBookingSlideOut
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </main>
  );
}