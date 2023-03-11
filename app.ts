/*app.ts*/
import express, { Express, Response } from "express"
import opentelemetry, { SpanStatus, SpanStatusCode } from "@opentelemetry/api"

const tracer = opentelemetry.trace.getTracer("marcellotest")
const PORT: number = parseInt(process.env.PORT || "8080")
const app: Express = express()

const reply = async (res: Response) => {
  res.send("Hello World")
}

const delay = async (millis: number) =>
  new Promise(resolve => setTimeout(resolve, millis))

const spandelay = (name: string, millis: number) =>
  tracer.startActiveSpan(name, async span => {
    await delay(millis)
    span.end()
  })
app.get("/", (req, res) => {
  tracer.startActiveSpan("hello", async span => {
    try {
      await reply(res)
      span.setAttribute("foo", "bar")
      await spandelay("first", 2)
      await delay(1)
      await spandelay("second", 2)
      if (Math.random() > 0.7)
        span.setStatus({ code: SpanStatusCode.ERROR, message: "random error" })
    } finally {
      span.end()
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`)
})
