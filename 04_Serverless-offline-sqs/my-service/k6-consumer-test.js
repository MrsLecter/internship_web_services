import http from "k6/http";

export const options = {
  batch: 1,
  batchPerHost: 1,

  stages: [{ duration: "1m", target: 10 }],
  thresholds: {
    runcounter: ["count>=100"],
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"],
  },
};
export default function () {
  const url = "http://localhost:3000/dev/consumer";

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  for (let i = 0; i <= 10; i++) {
    http.post(url, {}, params);
  }
}
