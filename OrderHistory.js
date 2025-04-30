import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Grid,
    Chip,
    Divider,
    Box,
    CircularProgress,
    Card,
    CardContent,
    Snackbar,
    Alert,
    IconButton,
    Collapse,
    Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const OrderHistory = ({ customerEmail }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/orders/customer/${customerEmail}`);
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
    }, [customerEmail]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
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
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
                Order History
            </Typography>

            {orders.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            No orders found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Your order history will appear here once you place an order
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <List>
                    {orders.map((order) => (
                        <Paper 
                            key={order._id} 
                            sx={{ 
                                mb: 3, 
                                p: 2, 
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                            Order #{order._id.slice(-6)}
                                            <Tooltip title={expandedOrders[order._id] ? "Hide details" : "Show details"}>
                                                <IconButton 
                                                    onClick={() => toggleOrderExpansion(order._id)}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                >
                                                    {expandedOrders[order._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </Typography>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {formatDate(order.orderDate)}
                                        </Typography>
                                        {order.deliveryDate && (
                                            <>
                                                <LocalShippingIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    Delivered: {formatDate(order.deliveryDate)}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Collapse in={expandedOrders[order._id]}>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Items:
                                            </Typography>
                                            {order.items.map((item) => (
                                                <ListItem key={item.productId._id} sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 1 }}>
                                                    <ListItemText
                                                        primary={item.productId.name}
                                                        secondary={`Quantity: ${item.quantity} - $${item.price.toFixed(2)}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </Box>

                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Order Details:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <PaymentIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            Payment: {order.paymentMethod}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Chip 
                                                            label={order.paymentStatus} 
                                                            size="small" 
                                                            color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                        <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                                        <Typography variant="body2">
                                                            {order.deliveryAddress}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Collapse>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1">
                                            Total Amount:
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            ${order.totalAmount.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </List>
            )}

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

export default OrderHistory; 