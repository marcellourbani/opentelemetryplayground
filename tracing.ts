import { NodeSDK } from "@opentelemetry/sdk-node"
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
})

sdk
  .start()
  .then(() => {
    console.log("Tracing initialized")
  })
  .catch(error => console.log("Error initializing tracing", error))
