interface Storage {
    getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;

    multiGet(
        keys: string[],
        callback?: (errors?: Error[], result?: [string, string | null][]) => void
    ): Promise<[string, string | null][]>;
}

export default function RNAsyncStorageFlipper(_storage: Storage): void;
