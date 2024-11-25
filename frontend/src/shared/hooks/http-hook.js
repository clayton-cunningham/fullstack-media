import { useCallback, useEffect, useRef, useState } from "react";


export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        try {
            const response = await fetch(
                url,
                {
                    method,
                    headers,
                    body
                }
            );

            activeHttpRequests.current = activeHttpRequests.current.filter(a => a !== httpAbortController);
            const responseData = await response.json();
            console.log(responseData);
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            setError(e.message || "An error occurred.");
            throw e;
        }
    }, [])

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(a => a.abort())
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
}