import { UseCasesFactory } from "../../../core/app/factory/use-case-factory"
import IHttpServer from "../../../types/http"
import Injectable from "../../di/Injectable"

export default abstract class HttpController {
    httpServer: IHttpServer
    @Injectable('factory_usecases')
    factory: UseCasesFactory
    constructor(httpServer: IHttpServer) {
        this.httpServer = httpServer
    }
    abstract handle(): void
}
