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
                const setItem = storage.setItem;
                const removeItem = storage.removeItem;

                storage.setItem = (key, value, ...rest) => {
                    setItem(key, value, ...rest);

                    let sendValue = value;
                    let needsToBeParsed = (sendValue.startsWith('{') && sendValue.endsWith('}')) || (sendValue.startsWith('[') && sendValue.endsWith(']'));

                    if (needsToBeParsed) {
                        sendValue = JSON.parse(sendValue);
                    }

                    currentConnection.send('newElement', {
                        key,
                        value: sendValue,
                        id: key,
                    });
                };

                storage.removeItem = (key, ...rest) => {
                    removeItem(key, ...rest);
                    currentConnection.send('newElement', {
                        key,
                        value: null,
                        id: key,
                    });
                };

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
