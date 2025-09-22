"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Product, ProductFormData } from "@/types/product";
import Loading from "./utility-component/Loading";

//import EmptyState from "./layouts/emptyStates/EmptyState";

// Sample products to show if none are fetched
const SAMPLE_PRODUCTS: ProductFormData[] = [
  {
    userId: "1",
    name: "HandBag",
    description: "Stylish and durable handbag for everyday use.",
    price: 999,
    category: "Fashion accessories",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRUSicaXmNwfpnpf7Mcry7XgBvjExZFFd745_vpzZ7x-5rWpK5wpnPF4QhznpvWLhRfcHeXH7tILpmlOMbFgQb0mS11QDKB59CvCFDAlKPu4Ud_zP-Z9DIvNXlyye5d6AFn_J2khD-C&usqp=CAc",
    stock: 10,
  },
  {
    userId: "2",
    name: "Mens sneakers",
    description: "Comfortable and stylish sneakers for Men.",
    price: 799,
    category: "Shoes",
    imageUrl: "/images/sneakers.png",
    stock: 5,
  },
  {
    userId: "3",
    name: "Headphones",
    description: "Premium quality headphones with noise cancellation.",
    price: 1299,
    category: "Electronics",
    imageUrl: "/images/headphones.png",
    stock: 8,
  },
  {
    userId: "4",
    name: "Mens wallet",
    description: "Genuine leather wallet with multiple compartments.",
    price: 499,
    category: "Fashion accessories",
    imageUrl: "/images/wallet.png",
    stock: 15,
  },
  {
    userId: "5",
    name: "Mens shirt",
    description: "Stylish and comfortable shirt for every occasion.",
    price: 1599,
    category: "Fashion",
    imageUrl: "/images/shirt.png",
    stock: 3,
  },
  // {
  //   userId: "6",
  //   name: "Sample Product 6",
  //   description: "High demand sample product.",
  //   price: 899,
  //   category: "Sample",
  //   stock: 12,
  // },
  // {
  //   userId: "7",
  //   name: "Sample Product 7",
  //   description: "Limited edition sample product.",
  //   price: 1999,
  //   category: "Sample",
  //   stock: 2,
  // },
  // {
  //   userId: "8",
  //   name: "Sample Product 8",
  //   description: "Eco-friendly sample product.",
  //   price: 699,
  //   category: "Sample",
  //   stock: 20,
  // },
  // {
  //   userId: "9",
  //   name: "Sample Product 9",
  //   description: "Popular sample product among customers.",
  //   price: 1099,
  //   category: "Sample",
  //   stock: 7,
  // },
  // {
  //   userId: "10",
  //   name: "Sample Product 10",
  //   description: "Top-rated sample product.",
  //   price: 1399,
  //   category: "Sample",
  //   stock: 6,
  // },
];
export default function FeaturedProducts() {
  //const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product/user");
        const productsData: Product[] = res.data;
        //top 10 products based on price
        const products = productsData
          .sort((a, b) => b.price - a.price)
          .slice(0, 10);
        setProducts(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return <Loading message="Loading Featured Products..." />;
  }
  // if (products.length === 0) {
  //   return (
  //     <div className="flex flex-col py-20">
  //       <main className="flex-1 flex items-center justify-center">
  //         <EmptyState
  //           title="No Products Available"
  //           description="Please check back later or contact support."
  //         />
  //       </main>
  //     </div>
  //   );
  // }
  const displayProducts = products.length === 0 ? SAMPLE_PRODUCTS : products;

  return (
    <section className="bg-beige py-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-olive">
            Featured Products
          </h2>
          <div className="w-32 h-1 bg-olive/40 mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-olive/70 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {displayProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link href={`/product/${product.id}`} className="block h-full">
                  <div
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
                    // onMouseEnter={() => setHoveredProduct(index)}
                    // onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Image Placeholder */}
                    <div className="relative aspect-square overflow-hidden bg-beige/30">
                      <div className="w-full h-full flex items-center justify-center">
                        {product.imageUrl ? (
                          // If using next/image, uncomment below and import Image from "next/image"
                          // <Image
                          //   src={product.imageUrl}
                          //   alt={product.name}
                          //   width={200}
                          //   height={200}
                          //   className="object-contain w-full h-full"
                          // />
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-olive/40 text-6xl">📦</span>
                        )}
                      </div>
                      <div className="absolute top-4 left-4 bg-olive/90 text-beige px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-olive mb-2 group-hover:text-olive/80">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-olive">
                          ₹{product.price}
                        </span>
                        {product.stock !== undefined && (
                          <span className="text-sm text-gray-400">
                            In Stock: {product.stock}
                          </span>
                        )}
                      </div>

                      <button className="mt-4 w-full bg-olive text-beige px-4 py-2 rounded-full text-sm font-medium hover:bg-olive/90  opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* View All Products Button */}
        <div className="text-center mt-16">
          <Link href="/product">
            <button className="bg-olive text-beige px-12 py-4 rounded-full text-lg font-semibold hover:bg-olive/90 transition-colors shadow-lg hover:shadow-xl">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
