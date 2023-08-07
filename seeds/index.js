const mongoose = require("mongoose");
const cities = require("./cities");
const axios = require("axios");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "bd2LuD1rNs58OVwVZ_R1jPfNo6SH4ZGeuYXWg3hG1a0",
        collections: 1114848,
      },
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 350; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const city = cities[random1000];
    const camp = new Campground({
      author: "643560d581a26a7065bede1a",
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dkz4tnm4m/image/upload/v1681867090/cld-sample-2.jpg",
          filename: "/cld-sample-2",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita sunt, nesciunt quae, soluta illo odit perferendis ullam ratione distinctio, aperiam unde voluptatum minus ipsam? Pariatur quasi magni alias natus iusto?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
