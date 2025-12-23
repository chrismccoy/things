require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { createUploadthing, createRouteHandler } = require("uploadthing/express");

const app = express();
const PORT = 3000;
const f = createUploadthing();

//  Configure UploadThing Router
const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => {
      console.log("Middleware: Request received");
      return { userId: "guest" };
    })
    .onUploadComplete((data) => {
      console.log("Upload Success:", data);
    }),
};

app.use(cors());
app.use(express.json());

// Serve the static HTML frontend
app.use(express.static(path.join(__dirname, "public")));

// Mount UploadThing API
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: { token: process.env.UPLOADTHING_TOKEN },
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
