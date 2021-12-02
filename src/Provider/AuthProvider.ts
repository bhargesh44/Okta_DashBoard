export const CreateAuthProvider = () => {

    const authFetch = async (
        input: RequestInfo,
        init?: RequestInit
    ): Promise<Response> => {
        const token = process.env.REACT_APP_OKTA_TOKEN;

        init = init || {};

        init.headers = {
            ...init.headers,
            Authorization: `SSWS ${token}`,
            ContentType: "application/json"

        };

        return fetch(input, init);
    };

    return {
        authFetch,
    };
};

export const { authFetch, } = CreateAuthProvider();
