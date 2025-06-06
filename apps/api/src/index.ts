import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.get("/", (_, res) => {
	res.send("Hello from Express + TypeScript!");
});

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
