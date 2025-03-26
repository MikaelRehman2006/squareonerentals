'use client';

import { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, TextField, Button, Avatar, Rating } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Realtor {
  id: string;
  name: string;
  photo: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  description: string;
  about: string;
}

const realtors: Realtor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo: '/avatars/realtor1.jpg',
    location: 'Downtown Toronto',
    rating: 4.8,
    reviews: 156,
    specialties: ['Luxury Rentals', 'Student Housing'],
    experience: '8',
    description: 'Highly experienced realtor with a passion for helping clients find their dream home.',
    about: 'Sarah has been in the real estate industry for over 8 years and has a proven track record of success.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    photo: '/avatars/realtor2.jpg',
    location: 'North York',
    rating: 4.9,
    reviews: 203,
    specialties: ['Condos', 'Family Homes'],
    experience: '12',
    description: 'Dedicated and knowledgeable realtor with a focus on providing exceptional client service.',
    about: 'Michael has been a realtor for over 12 years and has a deep understanding of the local market.'
  },
  // Add more realtors as needed
];

export default function RealtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredRealtors = realtors.filter(realtor => 
    realtor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    realtor.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Find a Realtor
      </Typography>
      
      <Box sx={{ my: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Filter by location"
          variant="outlined"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          InputProps={{
            startAdornment: <LocationOnIcon sx={{ mr: 1 }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredRealtors.map((realtor) => (
          <Grid item xs={12} md={6} key={realtor.id}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={realtor.photo}
                    alt={realtor.name}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="h2">
                        {realtor.name}
                      </Typography>
                      <VerifiedIcon color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {realtor.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={realtor.rating} precision={0.1} readOnly />
                    <Typography variant="body2">
                      ({realtor.reviews} reviews)
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {realtor.experience} years of experience
                  </Typography>
                </Box>

                <Typography variant="body2">
                  {realtor.description}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Specialties: {realtor.specialties.join(', ')}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {realtor.about}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Contact Realtor
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
