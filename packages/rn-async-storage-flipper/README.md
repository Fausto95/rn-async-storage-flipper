# Async-Storage Flipper

Async-Storage debugger for [Flipper](https://fbflipper.com/).

## Getting Started

1. Install these libraries in your react-native app.

```bash
yarn add rn-async-storage-flipper react-native-flipper
```

For iOS, you'll need to run

```bash
cd ios && pod install
```

2. Import the `rn-async-storage-flipper` library and pass as argument your storage instance.

```javascript
import RNAsyncStorageFlipper from 'rn-async-storage-flipper';

// ....
import AsyncStorage from '@react-native-community/async-storage';

RNAsyncStorageFlipper(AsyncStorage);
```

Note that you storage must have the following async methods:

-   `getAllKeys`

-   `multiGet`

3. Install the [flipper-plugin-async-storage](../flipper-plugin-async-storage) in Flipper app
