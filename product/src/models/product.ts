import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// shape of the data that we expect to receive when creating a new product and required to create new product
// and update product
interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  category: string;
  userId: string;
  stock?: number;
  imageUrl?: string;
}

//describe the properties that a Product Document has as it exists in MongoDB
//used to define the shape of the document in MongoDB and type checking
export interface ProductDoc extends mongoose.Document {
  name: string;
  price: number;
  userId: string;
  description?: string;
  category?: string;
  orderId?: string;
  stock?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number; // for optimistic concurrency control
}
export interface ProductEvent extends ProductDoc {
  id: string;
}
// describe the properties that a Product Model has stactic methods
//allow us to create custome methods for product model
//custome model class to create custome methods
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttributes): ProductDoc;
}

// define the schema for the product model
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    orderId: { type: String, required: false, default: null },
    stock: { type: Number, required: false, default: 0 },
    imageUrl: { type: String, required: false, default: null },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true, // adds createdAt and updatedAt
  }
);
productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttributes) => {
  return new Product(attrs);
};

//ties schema model class and doc interface together
const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product, ProductAttributes };
