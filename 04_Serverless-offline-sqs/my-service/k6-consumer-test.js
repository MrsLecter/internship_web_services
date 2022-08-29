import http from "k6/http";

export const options = {
  //parallel request
  batch: 1,
  batchPerHost: 1,

  stages: [{ duration: "1m", target: 10 }],
  thresholds: {
    runcounter: ["count>=1000"],
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<300"], // 95% of requests should be below 300ms
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
