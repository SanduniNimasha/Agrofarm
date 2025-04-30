import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Box,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps = ['Review Order', 'Delivery Details', 'Payment Method', 'Confirmation'];

const Checkout = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        paymentMethod: 'cash',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: ''
    });

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = useCallback(async () => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                navigate('/');
                return;
            }
            const response = await fetch(`http://localhost:5001/api/cart/${sessionId}`);
            if (!response.ok) throw new Error('Failed to fetch cart items');
            const data = await response.json();
            setCartItems(data.items || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load cart items');
            setLoading(false);
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    };

    const handleNext = () => {
        if (activeStep === 1) {
            // Validate delivery details
            if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.deliveryAddress) {
                setError('Please fill in all delivery details');
                return;
            }
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            const sessionId = localStorage.getItem('sessionId');
            
            // Validate payment details if card payment
            if (formData.paymentMethod === 'card') {
                if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
                    setError('Please fill in all payment details');
                    setLoading(false);
                    return;
                }
            }

            const orderData = {
                sessionId,
                customerDetails: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    phone: formData.customerPhone,
                    address: formData.deliveryAddress
                },
                paymentMethod: formData.paymentMethod
            };

            const response = await fetch('http://localhost:5001/api/orders/customer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Failed to place order');

            // Clear cart
            await fetch(`http://localhost:5001/api/cart/${sessionId}`, {
                method: 'DELETE'
            });

            localStorage.removeItem('sessionId');
            handleNext();
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Fade in timeout={500}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            {cartItems.map((item) => (
                                <Card key={item.productId._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                                <img
                                                    src={item.productId.image.startsWith('http') ? item.productId.image : `http://localhost:5001${item.productId.image}`}
                                                    alt={item.productId.name}
                                                    style={{ width: '100%', maxWidth: '150px', objectFit: 'cover' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="h6">{item.productId.name}</Typography>
                                                <Typography color="text.secondary">
                                                    Quantity: {item.quantity}
                                                </Typography>
                                                <Typography color="primary">
                                                    LKR {(item.productId.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Total Amount:</Typography>
                                <Typography variant="h6" color="primary">
                                    LKR {calculateTotal().toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Fade>
                );

            case 1:
                return (
                    <Fade in timeout={500}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Delivery Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Full Name"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        name="customerEmail"
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Phone Number"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Delivery Address"
                                        name="deliveryAddress"
                                        multiline
                                        rows={3}
                                        value={formData.deliveryAddress}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );

            case 2:
                return (
                    <Fade in timeout={500}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Payment Method
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    label="Payment Method"
                                >
                                    <MenuItem value="cash">Cash on Delivery</MenuItem>
                                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                                </Select>
                            </FormControl>

                            {formData.paymentMethod === 'card' && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Card Number"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Expiry Date"
                                            name="cardExpiry"
                                            value={formData.cardExpiry}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="CVC"
                                            name="cardCVC"
                                            value={formData.cardCVC}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 3:
                return (
                    <Fade in timeout={500}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom color="success.main">
                                Order Placed Successfully!
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Thank you for your order. We will send you an email confirmation shortly.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/orders')}
                            >
                                View Order History
                            </Button>
                        </Box>
                    </Fade>
                );

            default:
                return null;
        }
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
            <Paper sx={{ p: 4, mt: 4 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                        disabled={activeStep === steps.length - 1}
                    >
                        {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Checkout; 