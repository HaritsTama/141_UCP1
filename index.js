const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./models');
const hotel = require('./models/hotel');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`Server started on port 3000`);
});
db.sequelize.sync()
    .then((result) => {
        app.listen(3000, () => {
            console.log('Server started');
        })
    })
    .catch((err) => {
        console.log(err);
})

app.post('/hotel', async (req, res) => {
    const data = req.body;
    try {
        const hotel = await db.Hotel.create(data);
        res.send(hotel);
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.get('/hotel', async (req, res) => {
    try {
        const hotel = await db.Hotel.findAll();
        res.send(hotel);
    } 
    catch (error) {
        res.send({ message: error.message });
    }
});

app.put('/hotel/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const hotel = await db.Hotel.findByPk(id);
        if (!hotel) {
            return res.status(404).send({ message: 'Hotel not found' });
        }
        await hotel.update(data);
        res.send({ message: 'Hotel updated successfully', hotel });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

app.delete('/hotel/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const hotel = await db.Hotel.findByPk(id);
        if(!hotel){
            return res.status(404).send({ message: 'Hotel not found' });
        }
        await hotel.destroy();
        res.send({ message: 'Hotel deleted successfully' });
    }
    catch (error) {
        res.status(500).send(err);
    }
});
