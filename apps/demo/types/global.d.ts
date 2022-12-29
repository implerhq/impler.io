interface ITempreture {
  month: number;
  day: number;
  AverageTemperatureFahr: number;
  AverageTemperatureUncertaintyFahr: number;
  City: string;
  country_id: string;
  Country: string;
  Latitude: string;
  Longitude: string;
}

interface IErrorObject {
  error: string;
  message: string;
  statusCode: number;
}
