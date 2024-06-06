import path from "path";
import * as grpc from "@grpc/grpc-js";
import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";

const packageDefination = protoloader.loadSync(
  path.join(__dirname, "../src/a.proto")
);

const personProto = grpc.loadPackageDefinition(packageDefination);

const PERSONS = [
  {
    name: "vibhor",
    age: 45,
  },
  {
    name: "kanyte",
    age: 12,
  },
];

function addPerson(call: any, callback: any) {
  console.log(call);
  let person = {
    name: call.request.name,
    age: call.request.age,
  };
  PERSONS.push(person);
  callback(null, person);
}

function GetPersonByName(call: any, callback: any) {
  console.log(call);
  let name = call.request.name;

  let person = PERSONS.find((e) => e.name === name);
  callback(null, person);
}
const server = new grpc.Server();

//@ts-ignore
server.addService(personProto.AddressBookService.service, {
  addPerson: addPerson,
  GetPersonByName: GetPersonByName,
});

server.bindAsync(
  "0.0.0.0:5050",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
