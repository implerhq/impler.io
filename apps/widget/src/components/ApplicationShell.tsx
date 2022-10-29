import { useEffect } from 'react';
import { Global } from '@emotion/react';

export function WidgetShell({ children }: { children: JSX.Element }) {
  const WrapperComponent = inIframe() ? TransparentShell : MockPreviewShell;

  return <WrapperComponent>{children}</WrapperComponent>;
}

function TransparentShell({ children }: { children: JSX.Element }) {
  return <div>{children}</div>;
}

function MockPreviewShell({ children }: { children: JSX.Element }) {
  useEffect(() => {
    if (document.querySelector('body')) {
      (document.querySelector('body') as HTMLBodyElement).style.width = 'auto';
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'lightgray',
        height: '100vh',
        padding: '7px',
        color: '#333737',
      }}
    >
      <Global
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
          '*': {
            boxSizing: 'border-box',
          },
        }}
      />
      {children}
    </div>
  );
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
