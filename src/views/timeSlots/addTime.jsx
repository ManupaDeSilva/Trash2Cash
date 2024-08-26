import React, { useState } from 'react';
import { IconButton, TextField, Button, Grid, Box, Typography } from '@mui/material';
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
    title: 'Add Details',
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

const AddTime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, sector } = location.state;

  const formik = useFormik({
    initialValues: {
      timeSlots: [{ from: '', to: '', maxPickups: '' }],
    },
    validationSchema,
    onSubmit: async (values) => {
      const transformedData = values.timeSlots.map((slot) => ({
        date: dayjs(date).format('YYYY-MM-DD'),
        from: slot.from,
        to: slot.to,
        max: slot.maxPickups,
        sector: sector,
      }));

      console.log(transformedData);

      try {
        const response = await axios.post(
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
      { from: '', to: '', maxPickups: '' },
    ]);
  };

  return (
    <PageContainer title="Add Time Slot Details" description="This is the Time Slot Details">
      <Breadcrumb title="Add Details" items={BCrumb} />
      <DashboardCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Please add time slot details</Typography>
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
                        <Typography variant="h6">Time Slots {index + 1}</Typography>
                        {index !== 0 && (
                          <IconButton onClick={() => arrayHelpers.remove(index)} color="dark">
                            <DeleteIcon />
                          </IconButton>
                        )}
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
    </PageContainer>
  );
};

export default AddTime;
