import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native';
import axios from 'axios';

export default function CityScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  // Platform-safe alert
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Latitude & longitude for allowed cities
  const cityCoordinates = {
    rawalpindi: { lat: 33.5973, lon: 73.0479 },
    islamabad: { lat: 33.6844, lon: 73.0479 },
  };

  const handleCheckWeather = async () => {
    if (!city.trim()) {
      showAlert('Error', 'City name cannot be empty.');
      return;
    }

    const cityKey = city.toLowerCase();
    const coords = cityCoordinates[cityKey];

    if (!coords) {
      showAlert('Error', 'This city is not allowed.');
      return;
    }

    try {
      const apiKey = 'ed4edc241531b83fa81b822221d122e5';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;

      const response = await axios.get(url);
      const temp = response.data.main.temp;

      // Manually show user-entered city name (capitalized)
      const cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
      setWeather({ name: cityName, temp });
    } catch (error) {
      console.error('API Error:', error.message);
      showAlert('Error', 'Failed to fetch weather. Please check your connection or API key.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter City Name (Rawalpindi or Islamabad):</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={handleCheckWeather} />

      {weather && (
        <View style={styles.result}>
          <Text style={styles.resultText}>City: {weather.name}</Text>
          <Text style={styles.resultText}>Temperature: {weather.temp} °C</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
  result: { marginTop: 20 },
  resultText: { fontSize: 18, fontWeight: 'bold' },
});
