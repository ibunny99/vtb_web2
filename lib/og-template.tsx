import React from 'react';

export function renderSiteOgElement(title?: string, description?: string) {
  const displayTitle = title || 'VTB ROLEPLAY';
  const displayDesc =
    description ||
    'The Ultimate GTA V Roleplay Experience — Classic & Respect. / បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត - បុរាណ និងការគោរព។';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#090B0E',
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(0, 220, 255, 0.22), transparent 55%), radial-gradient(circle at 15% 85%, rgba(31, 38, 51, 0.7), transparent 45%), radial-gradient(circle at 85% 85%, rgba(0, 220, 255, 0.1), transparent 45%)',
        padding: '52px 64px',
        fontFamily: 'sans-serif',
        color: '#FFFFFF',
        position: 'relative',
      }}
    >
      {/* Cyber Border Frame */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '1px solid rgba(0, 220, 255, 0.25)',
          borderRadius: '24px',
          pointerEvents: 'none',
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '32px',
          height: '32px',
          borderTop: '3px solid #00DCFF',
          borderLeft: '3px solid #00DCFF',
          borderTopLeftRadius: '8px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderTop: '3px solid #00DCFF',
          borderRight: '3px solid #00DCFF',
          borderTopRightRadius: '8px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          width: '32px',
          height: '32px',
          borderBottom: '3px solid #00DCFF',
          borderLeft: '3px solid #00DCFF',
          borderBottomLeftRadius: '8px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderBottom: '3px solid #00DCFF',
          borderRight: '3px solid #00DCFF',
          borderBottomRightRadius: '8px',
        }}
      />

      {/* Top Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#00DCFF',
              color: '#090B0E',
              fontWeight: 900,
              fontSize: '26px',
            }}
          >
            V
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '4px',
              color: '#FFFFFF',
            }}
          >
            VTB ROLEPLAY
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 220, 255, 0.1)',
            border: '1px solid rgba(0, 220, 255, 0.35)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: '#00DCFF',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#00DCFF',
              textTransform: 'uppercase',
            }}
          >
            GTA V ROLEPLAY • ម៉ាស៊ីនមេ GTA V
          </span>
        </div>
      </div>

      {/* Center Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '960px',
          margin: 'auto 0',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: '18px',
            letterSpacing: '8px',
            fontWeight: 700,
            color: '#00DCFF',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          CLASSIC • RESPECT • DIVERSITY
        </span>

        <h1
          style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#FFFFFF',
            margin: '0 0 16px 0',
            lineHeight: 1.15,
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            textTransform: 'uppercase',
          }}
        >
          {displayTitle}
        </h1>

        <p
          style={{
            fontSize: '20px',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.75)',
            margin: '0 0 28px 0',
            maxWidth: '820px',
          }}
        >
          {displayDesc}
        </p>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(22, 27, 36, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '1px',
            }}
          >
            ✦ Custom Systems
          </div>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(22, 27, 36, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '1px',
            }}
          >
            ✦ High Performance
          </div>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(22, 27, 36, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '1px',
            }}
          >
            ✦ Great Community
          </div>
        </div>
      </div>

      {/* Bottom Bar / Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 600,
            letterSpacing: '1.5px',
          }}
        >
          DISCORD.GG/VTBRP
        </div>

        <div
          style={{
            fontSize: '14px',
            color: '#00DCFF',
            fontWeight: 800,
            letterSpacing: '2px',
          }}
        >
          VTBRP.NET
        </div>
      </div>
    </div>
  );
}
