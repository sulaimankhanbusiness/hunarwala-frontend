import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/i, '');

function resolveImg(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function getHelper(id: string) {
  try {
    const res = await fetch(`${API_BASE}/users/profile?userId=${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await getHelper(id);

  const name     = (h?.fullName     ?? 'Skilled Professional') as string;
  const headline = (h?.headline     ?? 'Available on HunarWalaa') as string;
  const city     = (h?.city         ?? 'Pakistan') as string;
  const bio      = (h?.bio          ?? '') as string;
  const rating   = h?.avgRating > 0    ? (h.avgRating as number).toFixed(1) : null;
  const jobs     = h?.jobsCompleted > 0 ? `${h.jobsCompleted as number}+`   : null;
  const verified = (h?.isVerified ?? false) as boolean;
  const photoUrl = resolveImg(h?.profileImage);
  const shortBio = bio.length > 120 ? bio.slice(0, 120) + '…' : bio;

  // ── Shared pill style (dark-blue bg) ──────────────────────────────────────
  const darkPill = {
    display:        'flex' as const,
    flexDirection:  'column' as const,
    alignItems:     'center' as const,
    justifyContent: 'center' as const,
    background:     'rgba(255,255,255,0.13)',
    borderRadius:   '16px',
    padding:        '14px 22px',
    gap:            '2px',
    minWidth:       '130px',
  };

  return new ImageResponse(
    (
      /* ── Root card ──────────────────────────────────────────────────────── */
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: 'sans-serif' }}>

        {/* ── BLUE TOP SECTION ─────────────────────────────────────────────── */}
        <div
          style={{
            display:    'flex',
            flex:       1,
            background: 'linear-gradient(135deg, #1A4DB5 0%, #2570EB 100%)',
            padding:    '44px 52px',
            gap:        '44px',
            alignItems: 'flex-start',
          }}
        >

          {/* ── Photo column ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', flexShrink: 0, width: '230px' }}>

            {/* Verified badge overlay */}
            {verified && (
              <div
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '6px',
                  position:     'absolute',
                  top:          '12px',
                  left:         '12px',
                  zIndex:       10,
                  background:   '#009C73',
                  borderRadius: '10px',
                  padding:      '6px 14px',
                  color:        'white',
                  fontSize:     '17px',
                  fontWeight:   700,
                }}
              >
                <span>✔️</span>
                <span>Verified</span>
              </div>
            )}

            {/* Photo */}
            {photoUrl ? (
              <img
                src={photoUrl}
                width={230}
                height={252}
                style={{ borderRadius: '20px 20px 0 0', objectFit: 'cover', display: 'flex' }}
              />
            ) : (
              <div
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  width:           '230px',
                  height:          '252px',
                  borderRadius:    '20px 20px 0 0',
                  background:      'rgba(255,255,255,0.15)',
                  fontSize:        '90px',
                  fontWeight:      900,
                  color:           'white',
                }}
              >
                {name[0] ?? 'P'}
              </div>
            )}

            {/* Rating bar */}
            <div
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '8px',
                background:   'white',
                borderRadius: '0 0 20px 20px',
                padding:      '12px 18px',
              }}
            >
              <span style={{ fontSize: '22px', display: 'flex' }}>⭐</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#21262E', display: 'flex' }}>
                {rating ?? '—'}
              </span>
              <span style={{ fontSize: '15px', color: '#5A7184', display: 'flex' }}>Client Rating</span>
            </div>
          </div>

          {/* ── Right content column ─────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '14px', paddingTop: '4px' }}>

            {/* Name + verified tick */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '50px', fontWeight: 900, color: 'white', lineHeight: '1', display: 'flex' }}>
                {name}
              </span>
              {verified && (
                <div
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    background:      '#2570EB',
                    border:          '3px solid white',
                    borderRadius:    '50%',
                    width:           '38px',
                    height:          '38px',
                    flexShrink:      0,
                  }}
                >
                  <span style={{ fontSize: '20px', display: 'flex' }}>✔️</span>
                </div>
              )}
            </div>

            {/* Headline */}
            <div style={{ display: 'flex', fontSize: '22px', color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>
              {headline}
            </div>

            {/* Stat pills row */}
            <div style={{ display: 'flex', gap: '12px' }}>

              {/* Rating pill — amber */}
              {rating && (
                <div
                  style={{
                    ...darkPill,
                    background: '#C45D15',
                  }}
                >
                  <span style={{ fontSize: '24px', display: 'flex' }}>⭐</span>
                  <span style={{ color: 'white', fontSize: '22px', fontWeight: 900, display: 'flex' }}>{rating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex' }}>Rating</span>
                </div>
              )}

              {/* City pill */}
              <div style={darkPill}>
                <span style={{ fontSize: '24px', display: 'flex' }}>📍</span>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, display: 'flex' }}>{city}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex' }}>Location</span>
              </div>

              {/* Jobs pill */}
              {jobs && (
                <div style={darkPill}>
                  <span style={{ fontSize: '24px', display: 'flex' }}>💼</span>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, display: 'flex' }}>{jobs}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex' }}>Jobs Done</span>
                </div>
              )}

              {/* Verified pill — green */}
              {verified && (
                <div style={{ ...darkPill, background: '#007A5A' }}>
                  <span style={{ fontSize: '24px', display: 'flex' }}>🛡️</span>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 900, display: 'flex' }}>Verified</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex' }}>Professional</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {shortBio && (
              <div
                style={{
                  display:    'flex',
                  fontSize:   '19px',
                  color:      'rgba(255,255,255,0.82)',
                  lineHeight: '1.5',
                  marginTop:  '2px',
                }}
              >
                {shortBio}
              </div>
            )}
          </div>
        </div>

        {/* ── WHITE BOTTOM SECTION ─────────────────────────────────────────── */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            background:     'white',
            padding:        '22px 52px 20px',
            gap:            '14px',
          }}
        >
          {/* View Profile button */}
          <div
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              background:      '#1C5FD0',
              borderRadius:    '14px',
              padding:         '16px 28px',
              gap:             '12px',
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', display: 'flex' }}>👁</span>
            <span style={{ color: 'white', fontSize: '26px', fontWeight: 900, display: 'flex' }}>View Profile</span>
            <span style={{ color: 'white', fontSize: '26px', fontWeight: 900, display: 'flex' }}>›</span>
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', justifyContent: 'center', color: '#5A7184', fontSize: '16px' }}>
            View full profile, work history, reviews &amp; more on hunarwalaa.com
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EAF2FF', borderRadius: '50%', width: '38px', height: '38px' }}>
                <span style={{ fontSize: '18px', display: 'flex' }}>🛡️</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, color: '#21262E', fontSize: '15px', display: 'flex' }}>Trusted Professional</span>
                <span style={{ color: '#5A7184', fontSize: '12px', display: 'flex' }}>Background verified</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EAF2FF', borderRadius: '50%', width: '38px', height: '38px' }}>
                <span style={{ fontSize: '18px', display: 'flex' }}>⏱️</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, color: '#21262E', fontSize: '15px', display: 'flex' }}>Quick Response</span>
                <span style={{ color: '#5A7184', fontSize: '12px', display: 'flex' }}>Usually responds fast</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EAF2FF', borderRadius: '50%', width: '38px', height: '38px' }}>
                <span style={{ fontSize: '18px', display: 'flex' }}>👍</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, color: '#21262E', fontSize: '15px', display: 'flex' }}>Reliable Service</span>
                <span style={{ color: '#5A7184', fontSize: '12px', display: 'flex' }}>100% client satisfaction</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2570EB', fontSize: '18px', fontWeight: 700 }}>
              <span style={{ display: 'flex' }}>hunarwalaa.com</span>
              <span style={{ display: 'flex' }}>↗</span>
            </div>

          </div>
        </div>

      </div>
    ),
    { width: 1200, height: 630 },
  );
}
