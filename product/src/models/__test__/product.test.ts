import { Product } from "../product";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const product = Product.build({
    name: "concert",
    price: 5,
    userId: "123",
    description: "desc",
    category: "cat",
    stock: 10,
  });

  // Save the ticket to the database
  await product.save();

  // fetch the ticket twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const product = Product.build({
    name: "concert",
    price: 20,
    userId: "123",
    description: "desc",
    category: "cat",
    stock: 10,
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});
