'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build innovative rental solutions that help people find their perfect home.',
    isNew: true,
    postedDate: new Date('2025-03-20'),
    isOpen: false,
  },
  {
    id: 2,
    title: 'Customer Service Representative',
    department: 'Support',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'Help our users navigate their rental journey with exceptional customer service and problem-solving skills.',
    isNew: false,
    postedDate: new Date('2025-03-15'),
    isOpen: false,
  },
  {
    id: 3,
    title: 'Compliance Moderator',
    department: 'Operations',
    location: 'Remote',
    type: 'Part-time',
    description: 'Ensure our platform maintains high standards by reviewing listings and enforcing community guidelines.',
    isNew: true,
    postedDate: new Date('2025-03-22'),
    isOpen: false,
  },
  {
    id: 4,
    title: 'Realtor Partnership Manager',
    department: 'Business',
    location: 'On-site',
    type: 'Full-time',
    description: 'Build and maintain relationships with realtors to grow our network of property listings.',
    isNew: false,
    postedDate: new Date('2025-03-10'),
    isOpen: false,
  },

  {
    id: 5,
    title: 'TEST',
    department: 'Business',
    location: 'On-site',
    type: 'Full-time',
    description: 'TESTING',
    isNew: true,
    postedDate: new Date('2025-03-25'),
    isOpen: true,
  },
];

const departments = ['All', 'Engineering', 'Support', 'Operations', 'Business'];

const MotionCard = motion(Card);

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredJobs = jobs.filter(
    (job) => selectedDepartment === 'All' || job.department === selectedDepartment
  );

  const handleDepartmentChange = (dept: string) => {
    setIsLoading(true);
    setSelectedDepartment(dept);
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Full-time':
      case 'Part-time':
        return <TimeIcon fontSize="small" />;
      case 'Remote':
      case 'Hybrid':
      case 'On-site':
        return <LocationIcon fontSize="small" />;
      default:
        return <WorkIcon fontSize="small" />;
    }
  };

  const isNewJob = (date: Date) => {
    const daysDifference = Math.floor(
      (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24)
    );
    return daysDifference <= 7;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          fontWeight={700}
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            backgroundImage: 'linear-gradient(45deg, #2196F3, #1976D2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Join Our Team
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: 'black' }}
        >
          We're building the future of rentals. Come be a part of it.
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 2,
          '::-webkit-scrollbar': {
            height: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        {departments.map((dept) => (
          <Chip
            key={dept}
            label={dept}
            onClick={() => handleDepartmentChange(dept)}
            sx={{
              px: 2,
              borderRadius: '16px',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              backgroundColor:
                selectedDepartment === dept
                  ? 'primary.main'
                  : 'background.paper',
              color:
                selectedDepartment === dept
                  ? 'primary.contrastText'
                  : 'text.primary',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor:
                  selectedDepartment === dept
                    ? 'primary.dark'
                    : 'action.hover',
              },
            }}
          />
        ))}
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6" sx={{ color: 'black' }}>
            No jobs found in this department
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleDepartmentChange('All')}
            sx={{ mt: 2 }}
          >
            View all positions
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job, index) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 500, color: 'black' }}
                    >
                      {job.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                      {isNewJob(job.postedDate) && (
                        <Chip
                          label="New"
                          color="primary"
                          size="small"
                        />
                      )}
                      <Chip
                        label={job.isOpen ? "Accepting Applications" : "Position Filled"}
                        color={job.isOpen ? "success" : "error"}
                        size="small"
                        sx={{
                          '& .MuiChip-label': {
                            fontWeight: 500
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <Chip
                      icon={<WorkIcon />}
                      label={job.department}
                      size="small"
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    />
                    <Chip
                      icon={<LocationIcon />}
                      label={job.location}
                      size="small"
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    />
                    <Chip
                      icon={<TimeIcon />}
                      label={job.type}
                      size="small"
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: 'black',
                    }}
                  >
                    {job.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={isMobile}
                    sx={{
                      mt: 'auto',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
