import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Fade,
    Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Cart = ({ onUpdateCount }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:5001/api/cart/${sessionId}`);
            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            setCartItems(data.items || []);
            if (onUpdateCount) {
                onUpdateCount(data.items?.length || 0);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load cart');
            setLoading(false);
            showSnackbar('Failed to load cart', 'error');
        }
    };

    const handleQuantityChange = async (productId, change) => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            const item = cartItems.find(item => item.productId._id === productId);
            const newQuantity = item.quantity + change;

            if (newQuantity < 1) {
                await handleRemoveItem(productId);
            } else {
                const response = await fetch(`http://localhost:5001/api/cart/${sessionId}/items/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: newQuantity }),
                });

                if (!response.ok) throw new Error('Failed to update quantity');
                const data = await response.json();
                setCartItems(data.items || []);
                if (onUpdateCount) {
                    onUpdateCount(data.items?.length || 0);
                }
                showSnackbar('Cart updated successfully', 'success');
            }
        } catch (err) {
            showSnackbar('Failed to update quantity', 'error');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            const response = await fetch(`http://localhost:5001/api/cart/${sessionId}/items/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove item');
            const data = await response.json();
            setCartItems(data.items || []);
            if (onUpdateCount) {
                onUpdateCount(data.items?.length || 0);
            }
            showSnackbar('Item removed from cart', 'success');
        } catch (err) {
            showSnackbar('Failed to remove item', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Fade in timeout={500}>
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Shopping Cart
                    </Typography>

                    {cartItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                Your cart is empty
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/')}
                                sx={{ mt: 2 }}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <List>
                                {cartItems.map((item) => (
                                    <React.Fragment key={item.productId._id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={item.productId.name}
                                                secondary={`LKR ${item.productId.price.toFixed(2)}`}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.productId._id, -1)}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.productId._id, 1)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleRemoveItem(item.productId._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>

                            <Box sx={{ mt: 4, textAlign: 'right' }}>
                                <Typography variant="h6" gutterBottom>
                                    Total: LKR {calculateTotal().toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Fade>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Cart; 