import { RegistryKey } from '../../types/registry'
import Registry from './registry'

export default function Injectable(name: RegistryKey) {
    return (target: any, propertyKey: string) => {
        target[propertyKey] = new Proxy(
            {},
            {
                get(_: any, propertyKey: string, receiver: any) {
                    const dependency = Registry.getInstance().inject(name)
                    return dependency[propertyKey]
                },
            }
        )
    }
}
