import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Autocomplete } from '@mui/material';
import { geocodeAddress } from '../../api/nominatim';

export const CheckoutForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inputValue.trim().length < 3) {
      setOptions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const results = await geocodeAddress(inputValue);
        if (results && results.length > 0) {
          // Убираем дубликаты и приводим к удобному формату
          const uniqueResults = Array.from(new Map(results.map((item) => [item.display_name, item])).values());
          setOptions(uniqueResults.map((r) => ({
            label: r.display_name,
            lat: r.lat,
            lon: r.lon
          })));
        } else {
          setOptions([]);
        }
      } catch (err) {
        setError('Сервис поиска адресов временно недоступен.');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 1500); // 1.5 сек задержка, чтобы не превысить лимит Nominatim (1 запрос в секунду)

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleSelectAddress = (event, newValue) => {
    if (newValue && typeof newValue === 'object' && newValue.lat) {
      setCoordinates({
        lat: newValue.lat,
        lon: newValue.lon,
        displayName: newValue.label
      });
      setError('');
    } else {
      setCoordinates(null);
    }
  };

  return (
    <Box component="form" sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, boxShadow: 1, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>
        Оформление заказа
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Autocomplete
          freeSolo
          options={options}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          filterOptions={(x) => x} // отключаем встроенную фильтрацию, так как фильтрует API
          loading={loading}
          inputValue={inputValue}
          onInputChange={(event, newInputValue, reason) => {
            setInputValue(newInputValue);
            if (reason === 'input' || reason === 'clear' || !newInputValue) {
              setCoordinates(null);
            }
          }}
          onChange={handleSelectAddress}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Адрес доставки"
              variant="outlined"
              placeholder="Начните вводить адрес (например: Москва...)"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {coordinates && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <strong>Адрес выбран!</strong><br />
          Координаты: {coordinates.lat}, {coordinates.lon}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {coordinates.displayName}
          </Typography>
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={!coordinates}
        sx={{ mt: 2 }}
      >
        Завершить оформление
      </Button>
    </Box>
  );
};
