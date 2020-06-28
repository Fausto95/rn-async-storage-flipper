import RNAsyncStorageFlipper from '.';

const mockStorageUsingAsync = {
    async getAllKeys() {
        return [
            'key-1',
            'key-2',
        ];
    },

    async multiGet(keys: string[]): Promise<[string, string | null][]> {
        return [
            ['key-1', null],
            ['key-2', 'value-2'],
        ];
    },
};

RNAsyncStorageFlipper(mockStorageUsingAsync);

const mockStorageUsingCallbacks = {
    getAllKeys(
        callback: (error?: Error, keys?: string[]) => void
    ): Promise<string[]> {
        return new Promise((resolve) => {
            resolve([
                'key-1',
                'key-2',
            ]);
        });
    },

    multiGet(
        keys: string[],
        callback: (
            errors?: Error[],
            result?: [string, string | null][]
        ) => void
    ): Promise<[string, string | null][]> {
        return new Promise((resolve) => {
            resolve([
                ['key-1', null],
                ['key-2', 'value-2'],
            ]);
        });
    },
};

RNAsyncStorageFlipper(mockStorageUsingCallbacks);
