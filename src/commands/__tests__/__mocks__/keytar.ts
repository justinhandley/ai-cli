const mockStorage: Record<string, Record<string, string>> = {};

const keytar = {
    setPassword: async (service: string, account: string, password: string): Promise<void> => {
        if (!mockStorage[service]) {
            mockStorage[service] = {};
        }
        mockStorage[service][account] = password;
        return Promise.resolve();
    },

    getPassword: async (service: string, account: string): Promise<string | null> => {
        return Promise.resolve(mockStorage[service]?.[account] || null);
    },

    deletePassword: async (service: string, account: string): Promise<boolean> => {
        if (mockStorage[service]?.[account]) {
            delete mockStorage[service][account];
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
};

export default keytar; 