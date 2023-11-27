const express = require("express");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const amqp = require("amqplib");
const cors = require('cors');

const app = express();

// import Global configurations
const configs = require("./config/configurations");

// Import MongoDB Schema's
const userSchema = require("./models/UserSchema");
const itemsSchema = require("./models/ItemsSchema");
const orderDetails = require("./models/OrderSchema");

// Import middleware Functionalities
const isAuthenticated = require("./middlewares/isAuthenticatedUser");
const isAdmin = require("./middlewares/isAdmin");
const isAppUser = require("./middlewares/isAppUser");

// Import Rest Functionalities
const loginFunctionality = require("./rest/Login");
const signupFunctionality = require("./rest/signup");
const userGetItems = require("./rest/userGetItems");
const adminGetItems = require("./rest/AdminGetItems");
const adminCreateItems = require("./rest/AdminCreateItems");
const adminDeleteItems = require("./rest/AdminDeleteItems");
const adminUpdateItems = require("./rest/AdminUpdateItems");
const localrabbitmq = "amqp://localhost:5672";
const cloudamqp = "amqps://sariyfaw:Bpd0xsMTerAir2YQjeUMKXHXvvulXb_V@shark.rmq.cloudamqp.com/sariyfaw";

let redisClient;
// Create a client and establish connection with the client.
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

(async () => {
  const amqpServer = cloudamqp;
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
})();

// app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set("view engine", "html");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/views"));
app.use(cors());

// Listen requests in the configured Port address
const server = app.listen(configs.APPLICATION_PORT, (err) => {
  if(err){
    console.log(err);
  }
  console.log(
    `Application Server is loaded and ready to listen in port: ${configs.APPLICATION_PORT}.`
  );
});

// Initialise socket
var io = require("socket.io")(server);

// Establish DB connection
userSchema.dbConnection();

// API's
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/signup", async (req, res) => {
  res.sendFile(__dirname+ "/views/signup.html"
  );
});

app.get("/signin", async (req, res) => {
  res.sendFile(__dirname+ "/views/signin.html"
  );
});

app.get("/getItems", isAuthenticated, userGetItems);

app.get("/homePage", isAuthenticated, isAppUser, async (req, res) => {
  res.sendFile(__dirname + "/views/homePage.html"
  );
});

app.get("/admin/homePage", isAuthenticated, isAdmin, async (req, res) => {
  res.sendFile(__dirname+
    "/views/AdminHomePage.html"
  );
});

app.get("/admin/getItems", isAuthenticated, isAdmin, adminGetItems.getAllItems);

app.get(
  "/admin/getAllItems",
  isAuthenticated,
  isAdmin,
  adminGetItems.getAllItems
);

app.get(
  "/admin/getTransactions",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const items = await orderDetails.find();
    return res.json(items);
  }
);

app.get(
  "/user/getTransactions",
  isAuthenticated,
  isAppUser,
  async (req, res) => {
    const userid = req.user.userId;
    const items = await orderDetails.find({ userid: userid });
    return res.json(items);
  }
);

app.get("/chatme", isAuthenticated, (req, res) => {
  res.sendFile(__dirname +
    "/views/chatbot.html"
  );
});

app.get("/logout", isAuthenticated, (req, res) => {
  res.cookie(configs.COOKIEKEY, "");
});

app.post("/signup", signupFunctionality);

app.post("/signin", loginFunctionality);

app.post("/homePage", isAuthenticated, isAppUser, async (req, res) => {
  res.sendFile(__dirname +
    "/views/homePage.html"
  );
});

app.post("/addItemsToCart", isAuthenticated, isAppUser, async (req, res) => {
  const products = [req.body];
  const items = await itemsSchema.find(
    {
      _id: {
        $in: products.map(function (product) {
          return product.id;
        }),
      },
    },
    {
      _id: 1,
      quantity: 1,
      price: 1,
    }
  );

  let validItems = 0;
  products.map(function (product) {
    items.forEach((t) => {
      if (
        t.id === product.id &&
        t.quantity >= Number(product.quantity) &&
        Number(product.quantity) > 0
      ) {
        validItems += 1;
        t.quantity = Number(product.quantity);
      }
    });
  });

  if (validItems !== products.length) {
    return res.json({ message: "InValid Cart" });
  }

  // await redisClient.del(req.user.userId);
  const cartItems = await redisClient.get(
    req.user.userId,
    function (err, reply) {
      console.log(reply);
    }
  );
  let appendedValue;
  if (cartItems) {
    appendedValue = cartItems.slice(0, -1);
    appendedValue += ",";
    appendedValue += JSON.stringify(items[0]).split('"_id":').join('"id":');
    appendedValue += "]";
  } else {
    appendedValue = JSON.stringify(items).split('"_id":').join('"id":');
  }

  console.log(appendedValue);

  await redisClient.set(req.user.userId, appendedValue, function (err, reply) {
    console.log(reply);
  });

  return res.json(items);
});

app.put("/OrderItems", isAuthenticated, isAppUser, async (req, res) => {
  const userId = req.user.userId;
  const cartItems = await redisClient.get(userId, function (err, reply) {
    console.log(reply);
  });

  if (!cartItems) {
    return res.redirect("/homePage");
  }
  console.log(JSON.parse(cartItems));

  channel.sendToQueue(
    "ORDERQUEUE",
    Buffer.from(
      JSON.stringify({
        userId,
        cartItems,
      })
    )
  );
  const result = await redisClient.del(userId);
  res.json({ message: "Retrieved cart from redis datastore." });
});

app.post("/admin/homePage", isAuthenticated, isAdmin, async (req, res) => {
  res.sendFile(__dirname+
    "/views/AdminHomePage.html"
  );
});

app.put("/createItems", isAuthenticated, isAdmin, adminCreateItems);

app.post("/updateItems", isAuthenticated, isAdmin, adminUpdateItems);

app.delete("/deleteItems", isAuthenticated, isAdmin, adminDeleteItems);

let questionsMap = {
  "Is the food fresh to eat?": "Yes, We only serve fresh food Daily.",
  "Want to know our best dishes?":
    "Do try Hyderabad Dum Biryani which is our best seller.",
  "What are the opening timings?":
    " We are open from 12:30PM to 11:30 PM everyday.",
  "Want to report any further issue?":
    "please call our Toll Free number: 1700-1234-1234",
  "What is the hotel location?": "Bellandur, Bengaluru, karnataka",
};

io.sockets.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected - : " + socket.id);
  });

  socket.on("new message", (msg) => {
    io.sockets.to(socket.id).emit("admin response", {
      message: [questionsMap[Object.keys(questionsMap)[msg - 1]]],
      user: socket.username,
    });
  });

  socket.on("new user", (usr) => {
    io.sockets.to(socket.id).emit("admin que response", {
      message: Object.keys(questionsMap),
      user: "admin",
    });
  });
});
