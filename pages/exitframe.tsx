import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ExitFrame() {
  const router = useRouter();

  useEffect(() => {
    const { redirectUri } = router.query;

    if (redirectUri && typeof redirectUri === 'string') {
      const decodedUri = decodeURIComponent(redirectUri);

      if (window.top === window.self) {
        window.location.href = decodedUri;
      } else {
        window.open(decodedUri, '_top');
      }
    } else {
      console.error('No redirectUri provided to exitframe');
    }
  }, [router.query]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting...</h2>
        <p>If you are not redirected automatically, please click the button below.</p>
        <button
          onClick={() => {
            const { redirectUri } = router.query;
            if (redirectUri && typeof redirectUri === 'string') {
              window.open(decodeURIComponent(redirectUri), '_top');
            }
          }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: '#5469d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Continue to Installation
        </button>
      </div>
    </div>
  );
}
