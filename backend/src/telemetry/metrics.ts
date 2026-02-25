import { Router } from "express";
import client from "prom-client";

const router = Router();

const collectDefault = client.collectDefaultMetrics;
collectDefault();

router.get("/", async (_req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (err) {
    res.status(500).send(err);
  }
});

export const metricsRouter = router;