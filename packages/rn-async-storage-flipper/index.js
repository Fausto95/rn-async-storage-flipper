import { addPlugin } from 'react-native-flipper';

function bootstrapPlugin() {
    return new Promise((resolve) => {
        addPlugin({
            getId: () => 'flipper-plugin-async-storage',
            onConnect: (connection) => {
                return resolve(connection);
            },
            onDisconnect: () => {},
            runInBackground: () => true,
        });
    });
}

function ReactNativeAsyncStorageFlipper(storage) {
    bootstrapPlugin()
        .then((currentConnection) => {
            if (currentConnection) {
                storage.getAllKeys().then((keys) => {
                    storage.multiGet(keys).then((data) => {
                        data.map((_, i, store) => {
                            let key = store[i][0];
                            let value = store[i][1];
                            let needsToBeParsed =
                                (value.startsWith('{') &&
                                    value.endsWith('}')) ||
                                (value.startsWith('[') && value.endsWith(']'));
                            if (needsToBeParsed) {
                                value = JSON.parse(value);
                            }
                            currentConnection.send('newElement', {
                                key,
                                value,
                                id: key,
                            });
                        });
                    });
                });
            }
        })
        .catch((err) => console.error(err));
}

export default ReactNativeAsyncStorageFlipper;
