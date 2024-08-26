import React from 'react';
import { Box, Button, Typography,TextField } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const AddFAQ = ({ onBack }) => {
  return (
    <PageContainer>
    <Box display={'flex'} justifyContent={'space-between'}> 
      <Typography variant="h5">Add a New FAQ</Typography>
      <Button onClick={onBack}
       variant="contained" 
       color="primary" 
       >Back</Button>
    </Box>
    <br></br>
    
    <Box mb={3}> 
        <Typography mb={2} variant='h6'>FAQ</Typography>   
        <TextField
                name="FAQ"
                placeholder="Type Here"
                //value={}
                //onChange={}
                variant="outlined"
                fullWidth
        />
    </Box>

    <Box mb={3}> 
    <Typography mb={2} variant='h6'>Answer</Typography>   
    <TextField
                name="FAQ"
                placeholder="Type Here"
                //value={}
                //onChange={}
                variant="outlined"
                fullWidth
              />
    </Box>

    <Box mb={3}> 
    <Typography mb={2} variant='h6'>Upload a Media</Typography>   
            <Button
            //onclick={}
            >
               Click here to upload
            </Button>
    </Box>
    <Box display={'flex'} justifyContent={'center'}>
        <Button variant="contained" 
        color="primary" 
        //onClick={}
        >
        Save
        </Button>
    </Box>
    </PageContainer>
    
  );
};

export default AddFAQ;
