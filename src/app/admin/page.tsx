'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is authorized
  useEffect(() => {
    if (!session?.user?.email || session.user.email !== 'mikaelr112@gmail.com') {
      router.push('/');
    }
  }, [session, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddAdmin = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdminEmail,
          role: 'ADMIN',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add admin user');
      }

      setSuccess('Admin user added successfully');
      setNewAdminEmail('');
      // Refresh admin users list
      fetchAdminUsers();
    } catch (err) {
      setError('Failed to add admin user');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch admin users');
      const data = await response.json();
      setAdminUsers(data.users);
    } catch (err) {
      setError('Failed to fetch admin users');
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  if (!session?.user?.email || session.user.email !== 'mikaelr112@gmail.com') {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Manage Admins" />
          <Tab label="User Management" />
          <Tab label="Site Settings" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Admin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" onClick={handleAddAdmin}>
              Add Admin
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          Current Admins
        </Typography>
        <List>
          {adminUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.email} secondary={`Role: ${user.role}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6">User Management Coming Soon</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6">Site Settings Coming Soon</Typography>
      </TabPanel>
    </Container>
  );
}