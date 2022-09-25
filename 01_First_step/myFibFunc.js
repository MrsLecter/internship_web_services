exports.handler = async (event) => {
  function GenerateFibonacci() {
    const fibonacci = [];
    fibonacci[0] = 0;
    fibonacci[1] = 1;
    for (var i = 2; i < 10; i++) {
      fibonacci[i] = fibonacci[i - 2] + fibonacci[i - 1];
    }
    return fibonacci.toString();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("First 10 Fibonacci numbers: " + GenerateFibonacci()),
  };
  return response;
};
