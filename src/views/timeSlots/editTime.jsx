import React, { useState } from 'react';
import {
  IconButton,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/timeSlots',
    title: 'Time Slots',
  },
  {
    title: 'Edit Details',
  },
];

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const validationSchema = yup.object().shape({
  timeSlots: yup.array().of(
    yup.object().shape({
      from: yup.string().required('From time is required'),
      to: yup.string().required('To time is required'),
      maxPickups: yup
        .number()
        .required('Maximum Pickups is required')
        .positive('Maximum Pickups must be greater than zero')
        .integer('Maximum Pickups must be an integer'),
    }),
  ),
});

const EditTime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, sector, timeslots } = location.state;

  const [open, setOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOpen = (index) => {
    setDeleteIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteIndex(null);
  };

  const handleDeleteConfirm = async () => {
    const id = formik.values.timeSlots[deleteIndex].id;
    try {
      await axios.delete(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots/${id}`,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      formik.setFieldValue(
        'timeSlots',
        formik.values.timeSlots.filter((_, i) => i !== deleteIndex),
      );
      handleClose();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      // alert('Failed to delete time slot. Please try again.');
    }
  };

  const initvals = () => {
    if (timeslots.length > 0) {
      return {
        timeSlots: timeslots.map((element) => ({
          id: element.id,
          from: element.from,
          to: element.to,
          maxPickups: element.max,
        })),
      };
    }
    return { timeSlots: [] };
  };

  const formik = useFormik({
    initialValues: initvals(),
    validationSchema,
    onSubmit: async (values) => {
      const transformedData = values.timeSlots.map((slot) => ({
        id: slot.id,
        date: dayjs(date).format('YYYY-MM-DD'),
        from: slot.from,
        to: slot.to,
        max: slot.maxPickups,
        sector: sector,
      }));

      console.log(transformedData);

      try {
        const response = await axios.put(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots',
          transformedData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.isSuccessful) {
            navigate('/timeSlots');
          } else {
            // Handle unsuccessful response
          }
        }
      } catch (error) {
        console.error('Error saving time slots:', error);
        alert('Failed to save time slots. Please try again.');
      }
    },
  });

  const addTimeSlot = () => {
    formik.setFieldValue('timeSlots', [
      ...formik.values.timeSlots,
      { id: null, from: '', to: '', maxPickups: '' },
    ]);
  };

  return (
    <PageContainer title="Edit Time Slot Details" description="This is the Time Slot Details">
      <Breadcrumb title="Edit Details" items={BCrumb} />
      <DashboardCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Please edit time slot details</Typography>
        </Box>
        <br></br>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date"
              variant="outlined"
              value={date.toDateString()}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Location"
              variant="outlined"
              value={sector}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <br></br>
        <br></br>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FieldArray
              name="timeSlots"
              render={(arrayHelpers) => (
                <>
                  {formik.values.timeSlots.map((slot, index) => (
                    <DashboardCard key={index}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Time Slot {index + 1}</Typography>
                        <IconButton
                          onClick={() =>
                            slot.id === null ? arrayHelpers.remove(index) : handleOpen(index)
                          }
                          color="dark"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <br></br>

                      <Grid container spacing={6}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="From"
                            variant="outlined"
                            fullWidth
                            type="time"
                            value={slot.from}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name={`timeSlots[${index}].from`}
                            error={Boolean(
                              formik.touched.timeSlots?.[index]?.from &&
                                formik.errors.timeSlots?.[index]?.from,
                            )}
                            helperText={
                              formik.touched.timeSlots?.[index]?.from &&
                              formik.errors.timeSlots?.[index]?.from
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="To"
                            variant="outlined"
                            fullWidth
                            type="time"
                            value={slot.to}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name={`timeSlots[${index}].to`}
                            error={Boolean(
                              formik.touched.timeSlots?.[index]?.to &&
                                formik.errors.timeSlots?.[index]?.to,
                            )}
                            helperText={
                              formik.touched.timeSlots?.[index]?.to &&
                              formik.errors.timeSlots?.[index]?.to
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Maximum Pickups"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={slot.maxPickups}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name={`timeSlots[${index}].maxPickups`}
                            inputProps={{ min: 1 }}
                            error={Boolean(
                              formik.touched.timeSlots?.[index]?.maxPickups &&
                                formik.errors.timeSlots?.[index]?.maxPickups,
                            )}
                            helperText={
                              formik.touched.timeSlots?.[index]?.maxPickups &&
                              formik.errors.timeSlots?.[index]?.maxPickups
                            }
                          />
                        </Grid>
                      </Grid>
                    </DashboardCard>
                  ))}
                  <br></br>
                  <DashboardCard>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Typography variant="h6" textAlign="center">
                        Add new Time Slot
                      </Typography>
                    </Box>
                    <br></br>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <IconButton
                        onClick={addTimeSlot}
                        sx={{
                          backgroundColor: '#f3f3f3',
                          color: '#878787',
                          '&:hover': {
                            backgroundColor: '#f3f3f3',
                          },
                        }}
                      >
                        <AddIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                    <br></br>
                  </DashboardCard>
                  <br></br>
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" type="submit">
                      Save
                    </Button>
                  </Box>
                </>
              )}
            />
          </form>
        </FormikProvider>
      </DashboardCard>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              outline: 'none',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Delete Time Slot
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to delete this time slot? This action cannot be undone
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </PageContainer>
  );
};

export default EditTime;
