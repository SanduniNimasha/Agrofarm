import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
    Card,
    CardContent,
    Fade
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders/admin');
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setSnackbar({
                open: true,
                message: 'Error loading orders',
                severity: 'error'
            });
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/orders/admin/${selectedOrder._id}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );
            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(orders.map(order => 
                    order._id === updatedOrder._id ? updatedOrder : order
                ));
                setOpenDialog(false);
                setSnackbar({
                    open: true,
                    message: 'Order status updated successfully',
                    severity: 'success'
                });
            } else {
                throw new Error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setSnackbar({
                open: true,
                message: 'Error updating order status',
                severity: 'error'
            });
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/orders/admin/${orderId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setOrders(orders.filter(order => order._id !== orderId));
                    setSnackbar({
                        open: true,
                        message: 'Order deleted successfully',
                        severity: 'success'
                    });
                } else {
                    throw new Error('Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                setSnackbar({
                    open: true,
                    message: 'Error deleting order',
                    severity: 'error'
                });
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
                Order Management
            </Typography>

            {orders.length === 0 ? (
                <Fade in timeout={500}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No orders found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Orders will appear here once customers place them
                            </Typography>
                        </CardContent>
                    </Card>
                </Fade>
            ) : (
                <Fade in timeout={500}>
                    <TableContainer 
                        component={Paper} 
                        sx={{ 
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Customer</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Items</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Total</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Order Date</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow 
                                        key={order._id}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                #{order._id.slice(-6)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2">{order.customerName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {order.customerEmail}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {order.items.length} items
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="primary">
                                                ${order.totalAmount.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(order.orderDate)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Edit Status">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setNewStatus(order.status);
                                                            setOpenDialog(true);
                                                        }}
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Order">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fade>
            )}

            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Fade}
            >
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleStatusChange} 
                        variant="contained" 
                        color="primary"
                        disabled={newStatus === selectedOrder?.status}
                    >
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default OrderManagement; 