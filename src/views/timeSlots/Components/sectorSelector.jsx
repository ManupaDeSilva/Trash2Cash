import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, DrawingManager } from '@react-google-maps/api';
import { Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import DeleteIcon from '@mui/icons-material/Delete';
import BackHandIcon from '@mui/icons-material/BackHand';
import PolylineIcon from '@mui/icons-material/Polyline';
import axios from 'axios';

const libraries = ['drawing'];
const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px', // Add rounded corners
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
  marginTop: '20px', // Add margin at the top
};

const center = {
  lat: 6.86523,
  lng: 79.8951351,
};

const MapComponent = ({setSector}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAqiRkh8Sj4hGbLbMiezln6AFIXG-6POFg', // Add your Google Maps API key
    libraries,
  });
  const mapRef = useRef();
  const drawingManagerRef = useRef();
  const [drawingMode, setDrawingMode] = useState(null);
  const shapeRef = useRef();
  const [shapeExists, setShapeExists] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('polygon');

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleOverlayComplete = useCallback((e) => {
    if (shapeExists) {
      setIsDialogOpen(true);
      e.overlay.setMap(null); // Remove the newly drawn shape
      return;
    }
    shapeRef.current = e.overlay;
    handleShapeComplete(e.overlay);
    setShapeExists(true);
  }, [shapeExists]);

  const handleShapeComplete = useCallback((shape) => {
    const path = shape.getPath().getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng(),
    }));
    console.log('Shape coordinates: ', path);
    setSector(path);
  }, []);

  const handleRemoveShape = useCallback(() => {
    if (shapeRef.current) {
      shapeRef.current.setMap(null);
      shapeRef.current = null;
      setShapeExists(false);
    }
  }, []);

  const handleToggleDrawing = () => {
    setDrawingMode(drawingMode === null ? selectedTool : null);
  };

  const handleDialogClose = useCallback((confirm) => {
    setIsDialogOpen(false);
    if (confirm) {
      handleRemoveShape();
      setDrawingMode('polygon');
    }
  }, [handleRemoveShape]);

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
    setDrawingMode(drawingMode !== null ? event.target.value : null);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <DashboardCard>
     
    <Box display="flex" mt={-2}>
      <Box flex={2} p ={2}>
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          onLoad={onMapLoad}
        >
          <DrawingManager
            onOverlayComplete={handleOverlayComplete}
            drawingMode={drawingMode}
            options={{
              drawingControl: false,
              circleOptions: {
                fillColor: '#2196F3',
                fillOpacity: 0.4,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: true,
                zIndex: 1,
              },
              rectangleOptions: {
                fillColor: '#2196F3',
                fillOpacity: 0.4,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: true,
                zIndex: 1,
              },
              polylineOptions: {
                fillColor: '#2196F3',
                fillOpacity: 0.4,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: true,
                zIndex: 1,
              },
              polygonOptions: {
                fillColor: '#2196F3',
                fillOpacity: 0.4,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: true,
                zIndex: 1,
              },
              
            }}
            ref={drawingManagerRef}
          />
        </GoogleMap>
      </Box>
      <Box flex={1} p={2} display="flex" flexDirection="column" alignItems="center">
        <DashboardCard>
        <FormControl fullWidth style={{ marginBottom: '10px', minWidth: 100 }}>
          <InputLabel id="drawing-tools-label">Drawing Tools</InputLabel>
          <Select
            labelId="drawing-tools-label"
            id="drawing-tools"
            value={selectedTool}
            onChange={handleToolChange}
          >
            <MenuItem value={'polygon'}> Polygon</MenuItem>
            <MenuItem value={'rectangle'}>Rectangle</MenuItem>
            <MenuItem value={'circle'}>Circle</MenuItem>
            <MenuItem value={'polyline'}>Polyline</MenuItem>
          </Select>
        </FormControl>
        <Button fullWidth variant="contained" onClick={handleRemoveShape} style={{ marginBottom: '10px' }}>
          <DeleteIcon/>
        </Button>
        <Button fullWidth variant="contained" onClick={handleToggleDrawing} style={{ marginBottom: '10px' }}>
          {drawingMode ? <BackHandIcon/> : <PolylineIcon/>}
        </Button>
        </DashboardCard>
      </Box>
      <Dialog open={isDialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>{"Confirm Shape Removal"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A shape already exists. Do you want to remove the previous shape and proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </DashboardCard>
  );
};

export default MapComponent;
