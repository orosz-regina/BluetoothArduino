import { Asset } from 'expo-asset';

const imageMap: { [key: string]: any } = {
left: Asset.fromModule(require('../assets/images/left.png')),
  right: Asset.fromModule(require('../assets/images/right.png')),
  forward: Asset.fromModule(require('../assets/images/forward.png')),
  default: Asset.fromModule(require('../assets/images/default.png')),
};

export default imageMap;
