const pool = require("../db");

const flightRoute = async (req, res) => {
    const { origin, destination } = req.body;

    try {
        // Check if the route already exists
        const existingRoute = await pool.query(
            'SELECT * FROM flight_routes WHERE origin = $1 AND destination = $2',
            [origin, destination]
        );

       if (existingRoute.rows.length > 0) {
            res.status(409).json({ message: 'Route already exists' });
        }

         else if (origin === destination) {
            res.status(409).json({ message: 'Origin and Destination cannot be same.' });

        } else {
            // Insert new flight route into the database
            const result = await pool.query(
                'INSERT INTO flight_routes (origin, destination) VALUES ($1, $2) RETURNING *',
                [origin, destination]
            );

            const newRoute = result.rows[0];

            console.log({ newRoute: newRoute });

            res.status(201).json({ message: "New flight route added successfully.", data: { source: newRoute.origin, destination: newRoute.destination, routeId : newRoute.id } });

        }


    } catch (error) {
        console.error('Error adding a new route:', error);
        res.status(500).json({ message: 'An internal server error occurred while adding new flight route.' });
    }
};

const flightConfiguration = async (req, res) => {
    try {
        const { flightClass, seatingCapacity, seatingArrangement } = req.body;

        // Check if the configuration already exists // 
        const existingConfiguration = await pool.query(
            'SELECT * FROM flight_configurations WHERE flight_class = $1 AND seats_available = $2 AND seating_arrangement = $3',
            [flightClass, seatingCapacity, seatingArrangement]
        );

        if (!existingConfiguration.rows[0]) {
            // Insert new flight route into the database
            const result = await pool.query(
                'INSERT INTO flight_configurations (flight_class, seats_available, seating_arrangement) VALUES ($1, $2, $3) RETURNING *',
                [flightClass, seatingCapacity, seatingArrangement]
            );

            res.status(201).json({ message: "Configuration added.", data: result.rows[0] });

        } else {
            res.status(200).json({ message: "Configuration already present in the list." });
        }

    } catch (error) {
        console.error('Error adding a new route:', error);
        res.status(500).json({ message: 'An internal server error occurred while adding new flight route.' });
    }
}

const flightDetails = async (req, res) => {
    try {
        // RouteId and ConfigurationId's will be provided through the list of Route and Configuration Get API. //
        const { origin, destination, routeId, configurationId_1, configurationId_2, configurationId_3, flightName, flightNumber, departureTime } = req.body;

        // Check route exists or not //
        const existingRoute = await pool.query(
            'SELECT * FROM flight_routes WHERE origin = $1 AND destination = $2',
            [origin, destination]
        );

        if (existingRoute.rows.length > 0) {
            // add new flight data //
            const result = await pool.query(
                'INSERT INTO flights (route_id, configuration_id_1, configuration_id_2, configuration_id_3, flight_name, flight_number, departure_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [routeId, configurationId_1, configurationId_2, configurationId_3, flightName, flightNumber, departureTime]
            );

            res.status(201).json({ message: "Flight added successfully.", data: result.rows[0] });

        } else {

            return res.status(409).json({ message: 'No route available. please add route first.' });
        }

    } catch (error) {
        console.error('Error adding flight details:', error);
        res.status(500).json({ message: 'An internal server error occurred while adding new flight details.' });
    }
}

module.exports = { flightRoute, flightConfiguration, flightDetails }