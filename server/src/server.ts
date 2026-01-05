import "dotenv/config";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";
import { deleteOldGuests } from "./jobs/deleteOldGuests";

async function bootstrap() {
  try {
    await connectDB();

    deleteOldGuests();

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Bootstrap failed", err);
    process.exit(1);
  }
}

bootstrap();
