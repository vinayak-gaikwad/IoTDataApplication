import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

import LoginAdminCheck from './LoginAdminCheck';
import { toast } from 'react-toastify';
import asyncToast from '../services/asyncToast';
import devices from '../services/devices';

const DeviceForm = ({ user, logout }) => {
  const { deviceType: paramDT } = useParams();
  const [deviceType, setDeviceType] = useState(
    paramDT !== 'new' ? paramDT : ''
  );
  const [description, setDescription] = useState('');
  const [deviceIDsInUse, setDeviceIDsInUse] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadDevice = async () => {
      try {
        const { data } = await devices.getDevice(deviceType);
        toast.success('Device fetched successfully!');
        setDescription(data.description);
        setDeviceIDsInUse(data.deviceIDsInUse);
      } catch (error) {
        toast.error(error.response.data);
        setNotFound(true);
        if (error.response.status === 401) logout();
      }
    };

    if (paramDT !== 'new') loadDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (paramDT === 'new') {
      const toastId = asyncToast.load('Adding device...');
      try {
        await devices.addNewDevice({ deviceType, description, deviceIDsInUse });
        asyncToast.update(toastId, 'success', 'Device added successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    } else {
      const toastId = asyncToast.load('Updating device...');
      try {
        await devices.editDevice(deviceType, { description, deviceIDsInUse });
        asyncToast.update(toastId, 'success', 'Device updated successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        {paramDT !== 'new' ? 'Update Device' : 'Add New Device'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LoginAdminCheck user={user} type="superadmin" />
        {user && user.isSuperAdmin && (
          <form noValidate autoComplete="off">
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ marginTop: 3 }}
              fullWidth
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              id="deviceType"
              label="Device Type"
              variant="outlined"
              disabled={paramDT !== 'new'}
              required
            />
            <TextField
              sx={{ marginTop: 3 }}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              label="Description"
              variant="outlined"
              required
            />
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ marginTop: 3 }}
              fullWidth
              value={deviceIDsInUse}
              onChange={(e) => setDeviceIDsInUse(e.target.value)}
              id="deviceIDsInUse"
              label="Device IDs In Use"
              variant="outlined"
              required
            />

            <Button
              fullWidth
              sx={{ marginTop: 3 }}
              disabled={
                notFound ||
                deviceType === '' ||
                description === '' ||
                deviceIDsInUse === ''
              }
              variant="contained"
              onClick={handleSubmit}
            >
              {paramDT !== 'new' ? 'Update Device' : 'Add Device'}
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default DeviceForm;
