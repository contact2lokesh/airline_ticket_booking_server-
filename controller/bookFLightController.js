const pool = require("../db");

const flights = async (req, res) => {
    const { origin, destination, date } = req.query;
    try {
        // Retrieve flight details matching the origin, destination, and date //
        const result = await pool.query(
            'SELECT * FROM flights JOIN flight_routes ON flights.route_id = flight_routes.id WHERE flight_routes.origin = $1 AND flight_routes.destination = $2 AND CAST(flights.departure_time AS DATE) = $3',
            [origin, destination, date]
        );

        if(!result.rows[0]){
            res.status(200).json({ message: 'No flights are available for this route.' });

        } else {
            const finalResult = await Promise.all(result.rows.map(async (data) => {
                // get configuration details //
                const configuratondetails = async (configurationId) => {
                    const configuratondetails = await pool.query(
                        'SELECT * FROM flight_configurations WHERE id = $1', [configurationId]
                    );
                    return configuratondetails.rows[0];
                }
    
                return {
                    "flightId": data.id,
                    "origin": data.origin,
                    "destination": data.destination,
                    "flightName": data.flight_name,
                    "flightNumber": data.flight_number,
                    "departureTime": data.departure_time,
                    "availableSeats": {
                        category_1: await configuratondetails(data.configuration_id_1),
                        category_2: await configuratondetails(data.configuration_id_2),
                        category_3: await configuratondetails(data.configuration_id_3),
                    }
                }
            }));
    
            res.status(200).json({ message: 'find Successfully', data: finalResult });
        }

        

    } catch (error) {
        console.error('Error retrieving flight details:', error);
        res.status(500).json({ message: 'An internal server error occurred during searching for flights between routes.' });
    }
};

const bookFlight = async (req, res) => {
    try {
        const { flightId, configurationId, passengerName, passengerAge, bookingPrice, bookingTime } = req.body;

        // check ticket available or not with configuration_id //
        const checkAvailabilty = await pool.query(
            'SELECT * FROM flight_configurations WHERE id = $1', [configurationId]
        );

        if (checkAvailabilty.rows[0].seats_available == 0) {
            res.status(409).json({ message: `No seats available in ${checkAvailabilty.rows[0].flight_class}` });
        } else {
            // update configuration when anyone book ticket //
            const updateConfiguration = await pool.query(
                'UPDATE flight_configurations SET seats_available = seats_available - 1 WHERE id = $1', [configurationId]
            );

            // set seat number with specific class.
            const seatNo = `${checkAvailabilty.rows[0].flight_class} - ${(checkAvailabilty.rows[0].seats_available) - 1}`;

            // get flight details // 
            const flightDetails = await pool.query(
                'SELECT * FROM flights WHERE id = $1', [flightId]
            );

            // get flight routes details //
            const flightRoutesDetails = await pool.query(
                'SELECT * FROM flight_routes WHERE id = $1', [flightDetails.rows[0].route_id]
            );

            // add bookings details in booking database //
            const bookTicket = await pool.query(
                'INSERT INTO bookings (flight_id, configuration_id, passenger_name, passenger_age, seat_no, booking_price, booking_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [flightId, configurationId, passengerName, passengerAge, seatNo, bookingPrice, bookingTime]
            );

            res.status(200).json({
                message: "flight booked successfully.",
                data: {
                    "origin": flightRoutesDetails.rows[0].origin,
                    "destination": flightRoutesDetails.rows[0].destination,
                    "booking_id": bookTicket.rows[0].booking_id,
                    "flight_id": bookTicket.rows[0].flight_id,
                    "configuration_id": bookTicket.rows[0].configuration_id,
                    "passenger_name": bookTicket.rows[0].passengerName,
                    "passenger_age": bookTicket.rows[0].passengerAge,
                    "seat_no": bookTicket.rows[0].seat_no,
                    "booking_price": bookTicket.rows[0].booking_price,
                    "booking_time": bookTicket.rows[0].booking_time,
                    "flight_name": flightDetails.rows[0].flight_name,
                    "flight_number": flightDetails.rows[0].flight_number,
                    "departure_time": flightDetails.rows[0].departure_time
                }
            });
        }
    } catch (error) {
        console.error('Error while booking the flight:', error);
        res.status(500).json({ message: 'An internal server error occurred while booking the flight.' });
    }
}


module.exports = { flights, bookFlight };