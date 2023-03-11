/*app.ts*/
import express, { Express, Response } from "express"
import opentelemetry, { Span, SpanStatusCode } from "@opentelemetry/api"

const tracer = opentelemetry.trace.getTracer("marcellotest")
const PORT: number = parseInt(process.env.PORT || "8080")
const app: Express = express()

const reply = async (res: Response) => {
  res.send("Hello World")
}

const delay = async (millis: number) =>
  new Promise(resolve => setTimeout(resolve, millis))

const spandelay = async (name: string, millis: number, parent: Span) => {
  const ctx = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    parent
  )
  const span = tracer.startSpan(name, undefined, ctx)
  await delay(millis)
  span.end()
}
app.get("/", async (req, res) => {
  const parent = tracer.startSpan("hello")
  try {
    await reply(res)
    parent.setAttribute("foo", "bar")
    await spandelay("first", 2, parent)
    parent.addEvent("Waiting...", { foo: 1, bar: "millis" })
    await delay(1)
    await spandelay("second", 2, parent)
    if (Math.random() > 0.7) throw new Error("random error")
  } catch (ex) {
    if (ex instanceof Error) parent.recordException(ex)
    parent.setStatus({ code: SpanStatusCode.ERROR })
  } finally {
    parent.end()
  }
})

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`)
})
