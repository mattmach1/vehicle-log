import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("OK")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})