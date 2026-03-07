/**
 * Extracts a human-readable error message from a backend error response.
 * Handles Axios error structures and standard NestJS error responses.
 */
export const getErrorMessage = (err: any, fallback: string = 'Something went wrong'): string => {
    // Check for Axios/NestJS error structure
    if (err.response?.data?.message) {
        const message = err.response.data.message;
        // NestJS can sometimes return message as an array of strings for validation errors
        return Array.isArray(message) ? message[0] : message;
    }

    // Check for standard error message
    if (err.message) {
        return err.message;
    }

    return fallback;
};
