import http from "k6/http";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      duration: '35s',
      rate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 1,//amount of users on start
      maxVUs: 10,//amount of users on end
    },
  },
};

export default function () {
  // const url_publisher = "http://localhost:3000/dev/publisher";
  const url_consumer = "http://localhost:3000/dev/consumer";
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
    // http.post(url_publisher,JSON.stringify({user: "testuser",token: "testtoken",}),params);
    http.post(url_consumer,{},params);
}

