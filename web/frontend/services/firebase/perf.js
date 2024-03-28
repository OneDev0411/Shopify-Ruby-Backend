import { getPerformance } from "firebase/performance";
import { firebaseApp } from "./firebase";
import { trace } from "firebase/performance";

export const perf = getPerformance(firebaseApp);

export const beginTrace = (
  metric
) => {
  const metricTrace = trace(perf, metric.replace('/', '').replaceAll('/', '_'));
  metricTrace.start();
  return metricTrace;
};

export const endTrace = (
  metricTrace
) => {
  // Stop the trace
  metricTrace.stop();
};

export const traceStat = (metric) => {
  const metricTrace = trace(perf, metric.name);
  // console.log(`${metric.name} METRIC TRACE`, metric)
  metricTrace.start();
  // let startTime , delta;
  let startTime = new Date().getTime(), delta = metric.delta;
  if (metric.name === 'LCP') {
    startTime = startTime - metric.delta;
  }
  if (metric.name === 'FID') {
    startTime = metric.entries[0]?.startTime
  }
  metricTrace.record(startTime, delta);
  // setTimeout(() => {
  //   endTrace(metricTrace)
  // }, time);
}