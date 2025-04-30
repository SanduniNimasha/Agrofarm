import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    Box,
    Badge,
    Fade,
    useTheme,
    useMediaQuery,
    Stack,
    Alert,
    Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, FlashOn } from '@mui/icons-material';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Cart from './components/orders/customer/Cart';
import OrderHistory from './components/orders/customer/OrderHistory';
import OrderManagement from './components/orders/admin/OrderManagement';
import Checkout from './components/orders/customer/Checkout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = 'http://localhost:5001/api';

// Add a function to handle API calls with dynamic port
const makeApiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: null
    });
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Get current tab based on location
    const getCurrentTab = () => {
        switch (location.pathname) {
            case '/':
                return 0;
            case '/cart':
                return 1;
            case '/orders':
            case '/admin/orders':
                return 2;
            default:
                return 0;
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCartCount();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch products',
                severity: 'error'
            });
        }
    };

    const fetchCartCount = async () => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                const response = await axios.get(`${API_URL}/cart/${sessionId}`);
                setCartItemCount(response.data.length || 0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    const handleOpenDialog = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                image: null
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                image: null
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            image: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/products/${editingProduct._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(`${API_URL}/products`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            handleCloseDialog();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        switch (newValue) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/cart');
                break;
            case 2:
                navigate(isAdmin ? '/admin/orders' : '/orders');
                break;
            default:
                navigate('/');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const sessionId = localStorage.getItem('sessionId') || generateSessionId();
            localStorage.setItem('sessionId', sessionId);

            const response = await axios.post(`${API_URL}/cart/${sessionId}/items`, {
                productId,
                quantity: 1
            });

            if (response.status === 200) {
                fetchCartCount();
                setSnackbar({
                    open: true,
                    message: 'Added to cart successfully',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add to cart',
                severity: 'error'
            });
        }
    };

    const handleBuyNow = (product) => {
        setSelectedProduct(product);
        setOpenProductDialog(true);
    };

    const handleCloseProductDialog = () => {
        setOpenProductDialog(false);
        setSelectedProduct(null);
    };

    const handleProceedToCheckout = async () => {
        try {
            await handleAddToCart(selectedProduct._id);
            handleCloseProductDialog();
            navigate('/checkout');
        } catch (error) {
            console.error('Error proceeding to checkout:', error);
        }
    };

    const generateSessionId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const renderProductCard = (product) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
                alt={product.name}
                sx={{ cursor: 'pointer', objectFit: 'cover' }}
                onClick={() => handleBuyNow(product)}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    LKR {product.price.toFixed(2)} per 100g
                </Typography>
                {isAdmin ? (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenDialog(product)}
                            fullWidth
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(product._id)}
                            fullWidth
                        >
                            Delete
                        </Button>
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(product._id)}
                            fullWidth
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<FlashOn />}
                            onClick={() => handleBuyNow(product)}
                            fullWidth
                        >
                            Buy Now
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Land of kings
                    </Typography>
                    {isAdmin && (
                        <Button
                            color="inherit"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(null)}
                            sx={{ mr: 2 }}
                        >
                            Add Product
                        </Button>
                    )}
                    <Button
                        color="inherit"
                        onClick={() => setIsAdmin(!isAdmin)}
                        startIcon={isAdmin ? <PersonIcon /> : <AdminPanelSettingsIcon />}
                        sx={{ mr: 2 }}
                    >
                        {isAdmin ? 'Customer View' : 'Admin View'}
                    </Button>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/cart')}
                    >
                        <Badge badgeContent={cartItemCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
                <Tabs
                    value={getCurrentTab()}
                    onChange={handleTabChange}
                    sx={{ bgcolor: 'primary.dark' }}
                >
                    <Tab label="Products" />
                    <Tab label="Cart" />
                    <Tab label={isAdmin ? "Order Management" : "Order History"} />
                </Tabs>
            </AppBar>

            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={
                        <Fade in timeout={500}>
                            <Grid container spacing={3}>
                                {products.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                                        {renderProductCard(product)}
                                    </Grid>
                                ))}
                            </Grid>
                        </Fade>
                    } />
                    <Route path="/cart" element={<Cart onUpdateCount={fetchCartCount} />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                </Routes>
            </Container>

            {/* Product Details Dialog */}
            <Dialog
                open={openProductDialog}
                onClose={handleCloseProductDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedProduct && (
                    <>
                        <DialogTitle>{selectedProduct.name}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <img
                                        src={selectedProduct.image.startsWith('http') ? selectedProduct.image : `${API_URL}${selectedProduct.image}`}
                                        alt={selectedProduct.name}
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedProduct.name}
                                    </Typography>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        LKR {selectedProduct.price.toFixed(2)} per 100g
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Fresh and high-quality vegetables directly from local farmers.
                                    </Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={() => {
                                                handleAddToCart(selectedProduct._id);
                                                handleCloseProductDialog();
                                            }}
                                            fullWidth
                                        >
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<FlashOn />}
                                            onClick={handleProceedToCheckout}
                                            fullWidth
                                        >
                                            Buy Now
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* Add/Edit Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Price (LKR per 100g)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ marginBottom: '16px' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingProduct ? 'Update' : 'Add'} Product
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App; 