module.exports.mockHelloData = async function mockHelloData(HelloModel) {
  await HelloModel.bulkCreate([
    { name: "vlad", foo: { test: 1 } },
    { name: "harun", foo: { test: 2 } },
  ]);
};

module.exports.mockHello2Data = async function mockHello2Data(Hello2Model) {
  await Hello2Model.bulkCreate([
    { name: "Qux", bar: { greet: 12 } },
    { name: "Quix", bar: { greet: 2 } },
  ]);
};
