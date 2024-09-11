import { RegistryKey } from "../../types/registry"

export default class Registry {
    private dependencies: {
        [name: string]: any
    }
    static instance: Registry
    private constructor() {
        this.dependencies = {}
    }
    provide(name: RegistryKey, dependency: any) {
        this.dependencies[name] = dependency
    }
    inject(name: RegistryKey) {
        return this.dependencies[name]
    }
    static getInstance() {
        if (!Registry.instance) {
            Registry.instance = new Registry()
        }
        return Registry.instance
    }
}
