import {
  BatchSpanProcessor,
  ParentBasedSampler,
  Sampler,
  SamplingResult,
  SamplingDecision
} from "@opentelemetry/sdk-trace-base"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"

registerInstrumentations({
  instrumentations: []
})

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "marcellotests",
    [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0"
  })
)

export class RandomSampler implements Sampler {
  shouldSample(): SamplingResult {
    const coinToss = Math.random() >= 0.5
    const decision = coinToss
      ? SamplingDecision.RECORD_AND_SAMPLED
      : SamplingDecision.NOT_RECORD
    return { decision }
  }
  toString(): string {
    return "RandomSampler"
  }
}

const provider = new NodeTracerProvider({
  resource: resource,
  sampler: new ParentBasedSampler({ root: new RandomSampler() })
})
// const exporter = new ConsoleSpanExporter()
const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
  headers: {}
})
const processor = new BatchSpanProcessor(exporter)
provider.addSpanProcessor(processor)

provider.register()
