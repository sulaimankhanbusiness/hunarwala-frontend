'use client';

import { Toaster } from 'sonner';

export const ToasterProvider = () => {
    return (
        <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            theme="light"
            gap={8}
            toastOptions={{
                style: {
                    borderRadius: '0.875rem',
                    padding: '0.875rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
                },
            }}
        />
    );
};
