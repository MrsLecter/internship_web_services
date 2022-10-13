import http from "k6/http";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "constant-arrival-rate",
      duration: "35s",
      rate: 100,
      timeUnit: "1s",
      preAllocatedVUs: 1,
      maxVUs: 10,
    },
  },
};

export default function () {
  //first step - load queue
  const url_publisher = "http://localhost:3000/dev/publisher";
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post(
    url_publisher,
    JSON.stringify({ user: "testuser", token: "testtoken" }),
    params,
  );

  //second step - dump queue
  /*
  const url_consumer = "http://localhost:3000/dev/consumer";
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post(url_consumer, {}, params);
  */
}
