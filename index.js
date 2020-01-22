const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

let users = [
    {
        id: "1",
        username: "example",
        name: "Johnny",
        dateOfBirth: "1990-05-20",
        address: "Measurement Street 567",
        city: "London",
        country: "uk",
        email: "john.doe@gmail.demo.com"
    }
]

let sensors = [
    {
        id: "1",
        deviceType: "arduino uno",
        description: "my device",
        latitude: "44 38 12.32",
        longitude: "-134 12 27.11",
        sensorType: "temperature",
        ownerName: "John Cena"
    }
]

let measurements = [
    {
        sensorId: "1",
        date: "1579507215000",
        measurement: "32C"
    }
]

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/users", (req, res) => {
    res.json(users);
})

app.post('/users', (req, res) => {
    console.log('Hello /users');

    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('name') && req.body.hasOwnProperty('dateOfBirth') && req.body.hasOwnProperty('address') && req.body.hasOwnProperty('city') && req.body.hasOwnProperty('country') && req.body.hasOwnProperty('email'))
    {
        const newId = users.length + 1

        users.push({
            id: newId,
            username: req.body.username,
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email
        })

        const result = {
            id: newId
        };

        res.status(201).json(result);
    }
    else
    {
        res.sendStatus(400);
    }
});

app.post('/users/:id/sensors', function (req, res) // req.params.id
{
    try
    {
        const userName = users.find(e => e.id == req.params.id).name
        const newId = sensors.length + 1;


        sensors.push({
            id: newId,
            deviceType: req.body.deviceType,
            description: req.body.description,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            sensorType: req.body.sensorType,
            ownerName: userName
        })

        const result = {
            id: newId
        };

        res.status(200).json(result)
    }
    catch(e)
    {
        res.sendStatus(400);
    }
});

app.post('/users/:id/sensors/:sensorId/measurement', function (req, res) // req.params.id       req.params.sensorId
{
    try
    {
        const userId = users.find(e => e.id == req.params.id).id;       // used to break the try in case the data is bad
        const sensorId = users.find(e => e.id == req.params.id).id;
        const currentTime = new Date().getTime();

        measurements.push({
            sensorId: this.sensorId,
            date: currentTime,
            measurement: req.body.measurement
        })

        const result = {
            measurement: req.body.measurement,
            date: new Date(currentTime).toUTCString(),
            username: users.find(e => e.id == req.params.id).name
        }

        res.status(200).json(result)
    }
    catch(e)
    {
        res.sendStatus(400);
    }
});

app.get('/measurements', function (req, res)
{
    const result = [];

    measurements.forEach(measurement => {
        const thisSensor = sensors.find(sensor => sensor.id == measurement.sensorId);

        result.push({
            username: thisSensor.ownerName,
            sensorType: thisSensor.sensorType,
            latitude: thisSensor.latitude,
            longitude: thisSensor.longitude,
            date: new Date(measurement.date).toUTCString(),
            measurement: measurement.measurement
        });
    })

    res.status(200).json(result);
});

app.get('/measurements/:date1/:date2', function (req, res)
{
    const date1 = req.params.date1;
    const date2 = req.params.date2;
    const result = [];

    measurements.forEach(measurement => {

        if (parseInt(date1) < parseInt(measurement.date) && parseInt(measurement.date) < parseInt(date2))
        {
            const thisSensor = sensors.find(sensor => sensor.id == measurement.sensorId);

            result.push({
                username: thisSensor.ownerName,
                sensorType: thisSensor.sensorType,
                latitude: thisSensor.latitude,
                longitude: thisSensor.longitude,
                date: measurement.date,
                measurement: measurement.measurement
            });
        }
    })

    res.status(200).json(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))