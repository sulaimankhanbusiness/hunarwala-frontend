'use client';

import { Toaster } from 'sonner';

export const ToasterProvider = () => {
    return (
        <Toaster
            position="top-center"
            expand={false}
            richColors
            closeButton
            theme="light"
            toastOptions={{
                style: {
                    borderRadius: '1rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                },
            }}
        />
    );
};
