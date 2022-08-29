import http from "k6/http";

export const options = {
  //parallel request
  batch: 1,
  batchPerHost: 1,

  stages: [
    { duration: "1s", target: 1 },
    { duration: "1s", target: 50 },
    { duration: "1s", target: 100 },
    { duration: "0s", target: 100 },
    { duration: "1s", target: 200 },
    { duration: "1s", target: 200 },
    { duration: "1s", target: 50 },
    { duration: "0s", target: 50 },
  ],
  thresholds: {
    runcounter: ["count>=1000"],
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

export default function () {
  const url = "http://localhost:3000/dev/publisher";
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  for (let i = 0; i <= 10; i++) {
    http.post(
      url,
      JSON.stringify({
        user: "testuser",
        token: "testtoken",
      }),
      params
    );
  }
}
