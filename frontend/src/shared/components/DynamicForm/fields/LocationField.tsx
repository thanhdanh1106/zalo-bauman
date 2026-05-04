import RoomIcon from '@mui/icons-material/Room';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

interface LocationProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
  onChange: (value: { address: string; lat: number; lng: number }) => void;
}

const LocationPicker = ({
  label,
  defaultValue,
  required,
  onChange,
}: LocationProps) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [autocompletePredictions, setAutocompletePredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [searchAddressInput, setSearchAddressInput] = useState<string>(
    defaultValue?.address || ''
  );
  const [searchLocation, setSearchedLocation] =
    useState<google.maps.LatLngLiteral | null>(
      defaultValue?.lat && defaultValue?.lng
        ? {
            lat: defaultValue?.lat,
            lng: defaultValue?.lng,
          }
        : {
            lat: -37.817806,
            lng: 144.956123,
          }
    );

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchAddressInput(value);
      setSearchedLocation(null);

      if (autocompleteService && value.length > 2) {
        autocompleteService.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: 'au' },
          },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              console.log('predictions', predictions);
              setAutocompletePredictions(predictions);
            } else {
              setAutocompletePredictions([]);
            }
          }
        );
      } else {
        setAutocompletePredictions([]);
      }
    },
    [autocompleteService]
  );

  const handlePredictionClick = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      setSearchAddressInput(prediction.description);
      setAutocompletePredictions([]);

      if (placesService) {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: ['geometry.location'], // Chỉ lấy tọa độ
          },
          (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place?.geometry?.location
            ) {
              const latLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              if (latLng && map) {
                map.setCenter(latLng);
                map.setZoom(18);
              }
              setSearchedLocation(latLng);
              setDisabled(true);
              onChange({
                address: prediction.description,
                ...latLng,
              });
            } else {
              setSearchedLocation(null);
            }
          }
        );
      }
    },
    [placesService, map]
  );

  useEffect(() => {
    if (placesLibrary) {
      if (!autocompleteService) {
        setAutocompleteService(new placesLibrary.AutocompleteService());
      }
      if (!placesService) {
        setPlacesService(
          new placesLibrary.PlacesService(document.createElement('div'))
        );
      }
    }
  }, [placesLibrary, autocompleteService, placesService]);

  const defaultMapCenter = useMemo(() => {
    return {
      lat: defaultValue?.lat || -37.817806,
      lng: defaultValue?.lng || 144.956123,
    };
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ width: '100%' }} error={searchAddressInput == ''}>
          <FormLabel htmlFor={`${name}-label`}>
            {label ? label : 'Address'}{' '}
            {required ? <span className="text-red-600">*</span> : ''}
          </FormLabel>
          <TextField
            id="search-input"
            type="text"
            placeholder="Fill your detailed address..."
            value={searchAddressInput}
            disabled={disabled}
            size="small"
            onChange={handleSearchInputChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      disabled={!disabled}
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setDisabled(false);
                        setSearchAddressInput('');
                      }}
                    >
                      Clear
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
          {autocompletePredictions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 top-full max-h-40 overflow-y-auto z-[50]">
              {autocompletePredictions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  onClick={() => handlePredictionClick(prediction)}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  {prediction.description}
                </li>
              ))}
            </ul>
          )}
        </FormControl>
        <div className="h-[400px] mt-5 bg-white border border-slate-200   rounded-lg p-3 flex-wrap gap-3 duration-300">
          <Map
            defaultCenter={defaultMapCenter}
            defaultZoom={18}
            mapId="DEMO_MAP_ID"
            gestureHandling={'greedy'}
          >
            {searchLocation && (
              <AdvancedMarker
                position={searchLocation}
                title={[searchAddressInput].filter(Boolean).join(', ')}
              >
                <RoomIcon
                  className="text-red-600"
                  sx={{ width: 30, height: 30 }}
                />
              </AdvancedMarker>
            )}
          </Map>
        </div>
      </Box>
    </Box>
  );
};

export const LocationField = ({
  name,
  control,
  label,
  required = false,
  error,
  description,
  helper_text,
}: LocationProps) => {
  const { field } = useController({
    name,
    control,
  });

  function handleChangeData(value: {
    address: string;
    lat: number;
    lng: number;
  }) {
    field.onChange(value);
  }

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAP_API as string}
      libraries={['marker', 'places', 'geometry']}
    >
      <LocationPicker
        name={field.name}
        defaultValue={field.value}
        onChange={(value) => handleChangeData(value)}
      />
    </APIProvider>
  );
};


