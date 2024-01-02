import { EMAIL_TEMPLATE } from './email.templat.mjs';
import { EmailClient } from "@azure/communication-email";
import express from 'express';
import bodyParser from 'body-parser';
const app = express()
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// These keys will be changed over time, the ideal would be to do them with dotenv, but due to time it is not possible to configure it
const ACCESS_KEY = process.env.API_KEY_EMAIL;
const client = new EmailClient(ACCESS_KEY);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/send-email', async (req, res) => {
    const {name, roomName, hotelName, price, numberGuest, emailTo} = req.body;


    try {
      const message = {
        senderAddress: "DoNotReply@27525144-886b-4118-861e-43320c32d6b0.azurecomm.net",
        content: {
          subject: "¡Bienvenido! Aquí esta su reserva.",
          html: EMAIL_TEMPLATE(name, roomName, hotelName, price, numberGuest)
        },
        recipients: {
          to: [
            {
              address: emailTo,
            },
          ],
        },
      };
      const poller = await client.beginSend(message);
      res.status(200).json({ message: 'Email to sent successful!' });
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Error to sent email.' });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})